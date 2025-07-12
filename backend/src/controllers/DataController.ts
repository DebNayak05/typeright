import { createTest } from "../db/TestModel";
import express from "express";
import { getUserBySessionToken } from "../db/UserModel";
import { getTestsByUserId } from "../db/TestModel";
import { generateTypingParagraph } from "../groq/getText";
export const postmistakes = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { mistakes, wpm, accuracy } = req.body;
    const userId = req.userId;
    if (!userId || !wpm || !accuracy) {
      console.log(userId);
      console.log(accuracy);
      console.log(wpm);
      return res.status(400).json({
        message: "please login first",
      });
    }
    const newTest = {
      userId: userId,
      wpm: wpm,
      accuracy: accuracy,
      mistake: mistakes,
    };
    const test = await createTest(newTest);
    return res.status(200).json({ message: "user created", test: test });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
};

export const fetchprofile = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = req.userId;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Missing or invalid userId" });
    }

    const tests = await getTestsByUserId(userId);

    return res.status(200).json({ message: "Profile data fetched", tests });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(400).json({ message: "Failed to fetch profile data" });
  }
};

export const userExists = async (
  req: express.Request,
  res: express.Response,
) => {
  return res.status(200).json({ message: "User Exists" });
};

export const getUserData = async (
  req: express.Request,
  res: express.Response,
) => {
  const sessionToken = req.cookies["sessionToken"];
  if (!sessionToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const existingUser = await getUserBySessionToken(sessionToken);
  if (!existingUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const email = existingUser.email,
    name = existingUser.name,
    id = existingUser._id;
  return res.status(200).json({ message: "User exists", email, name, id });
};

export const generateText = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.body;
  let mistakeMap = new Map<string, number>();
  try {
    const tests = id ? await getTestsByUserId(id).limit(5) : [];
    tests.forEach((test) => {
      test.mistake.forEach((mistake) => {
        const char = `${mistake.correct}`;
        mistakeMap.set(char, (mistakeMap.get(char) || 0) + 1);
      });
    });
    const text = await generateTypingParagraph(mistakeMap);
    return res
      .status(200)
      .json({ message: "Text generated successfully", text: text });
  } catch (error) {
    console.error("Error generating text:", error);
    return res.status(500).json({ message: "Failed to generate text" });
  }
};
