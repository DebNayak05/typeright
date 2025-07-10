import { createTest } from "../db/TestModel";
import express from "express";
export const postmistakes = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { mistakes, userId, wpm, accuracy } = req.body;
        if (!userId || !wpm || !accuracy) {
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
import { getTestsByUserId } from "../db/TestModel";

export const fetchprofile = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { userId } = req.body;

        if (!userId || typeof userId !== "string") {
            return res
                .status(400)
                .json({ message: "Missing or invalid userId" });
        }

        const tests = await getTestsByUserId(userId);

        return res.status(200).json({ message: "Profile data fetched", tests });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res
            .status(400)
            .json({ message: "Failed to fetch profile data" });
    }
};
