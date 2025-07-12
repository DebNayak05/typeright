import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildGroqUserPrompt(mistakeMap: Map<string, number>) {
  if (mistakeMap.size === 0) {
    return `You are a typing test generator.

                Generate a **natural, fluent, 120-word English paragraph** suitable for a typing test.

                Requirements:
                - The paragraph should be neutral and balanced — no letter bias.
                - Avoid robotic or repetitive phrasing.
                - Do not mention typing, users, or instructions.
                - Use clean, everyday English vocabulary.
                - No quotes, bullet points, or formatting.

                Return only the plain paragraph. Do not explain anything.
                `.trim();
  }
  const sorted = [...mistakeMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([char, count]) => `- ${char}: ${count}`)
    .join("\n");

  return `
            The user frequently mistypes the following characters (based on their last 5 typing tests):

            ${sorted}

            Your task is to write a natural, fluent, 120-word paragraph in English, suitable for a typing test.

            Requirements:
            - Letters with higher mistake frequency should appear slightly more often.
            - Do not overuse any letter or make the text robotic.
            - The text must read like normal English — no repeating patterns, no forced phrasing.
            - Do not mention errors, mistakes, or the user.
            - No special formatting or markdown.

            Only return the plain paragraph. Do not add explanations or greetings.
            `.trim();
}

export async function generateTypingParagraph(mistakeMap: Map<string, number>) {
  const systemPrompt = `You are a professional typing test assistant.

                        Your job is to generate natural English typing test paragraphs based on user mistake data. 
                        You do not explain or mention user mistakes. You never refer to typing, performance, or feedback.

                        Always return a clean, fluent paragraph that subtly increases the occurrence of certain characters, based on mistake frequency data provided to you.`;
  const userPrompt = buildGroqUserPrompt(mistakeMap);
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });
  return chatCompletion.choices[0].message.content.trim();
}
