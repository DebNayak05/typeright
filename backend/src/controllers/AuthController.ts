import { createUser, getUserByEmail } from "../db/UserModel";
import express from "express";
import { createHashedPassword } from "../helpers/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "invalid input",
            });
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: "email already exists",
            });
        }
        const hashedPassword = await createHashedPassword(password);
        const newUser = {
            name: name,
            email: email,
            authentication: {
                password: hashedPassword,
            },
        };
        const user = await createUser(newUser);
        return res.status(200).json({ message: "user created", user: user });
    } catch (error) {
        console.log(error);
    }
};
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "invalid input",
            });
        }
        const existingUser = await getUserByEmail(email).select(
            "authentication.password"
        );
        if (!existingUser) {
            return res.status(400).json({
                message: "user doesn't exist",
            });
        }
        const validPassword = await bcrypt.compare(
            password,
            existingUser.authentication.password
        );
        if (!validPassword) {
            return res.status(400).json({
                message: "invalid password",
            });
        }
        const sessionToken = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        existingUser.authentication.sessionToken = sessionToken;
        await existingUser.save();
        res.cookie("sessionToken", sessionToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
        return res.status(200).json({ message: "login successful" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Something went wrong",
        });
    }
};
