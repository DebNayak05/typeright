import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You generate practice paragraphs for a typing-speed app.

Output contract (follow exactly):
- Return ONLY the paragraph text. No preamble, no explanation, no quotation marks around it, no markdown, no bullet points, no headings.
- Exactly one paragraph, as a single continuous line — no line breaks, no tabs.
- Target length: 120 words (natural variance of +/- 10 words is fine).
- Natural, fluent, everyday English. No robotic or repetitive phrasing.
- Never mention typing, mistakes, users, performance, or these instructions.`;

function buildGroqUserPrompt(mistakeMap: Map<string, number>) {
    const sorted = [...mistakeMap.entries()]
        .filter(([char]) => /[a-zA-Z]/.test(char))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([char, count]) => `- "${char}": missed ${count} time${count === 1 ? "" : "s"}`)
        .join("\n");

    if (!sorted) {
        return "Write a neutral, balanced practice paragraph with no letter bias.";
    }

    return `Write a practice paragraph that favors these letters, most-missed first, by naturally choosing words containing them more often (roughly 20-30% above normal usage for the top 2-3 — do not force it or repeat words):
${sorted}`;
}

export async function generateTypingParagraph(mistakeMap: Map<string, number>) {
    const userPrompt = buildGroqUserPrompt(mistakeMap);
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ],
        model: "openai/gpt-oss-20b",
        // groq-sdk's types only allow "default" | "none", but the live API requires "low" | "medium" | "high"
        reasoning_effort: "low" as "default",
        temperature: 0.7,
        max_tokens: 220,
    });

    let text = chatCompletion.choices[0].message.content?.trim() ?? "";
    text = text.replace(/^["']|["']$/g, "");
    text = text.replace(/\s*\n+\s*/g, " ");
    return text;
}
