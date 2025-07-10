import mongoose, { Document } from "mongoose";

interface Mistake {
    index: number;
    correct: string;
    wrong: string;
}

export interface Test extends Document {
    userId: string;
    wpm: number;
    accuracy: number;
    mistake: Mistake[];
}

interface CreateTestInput {
    userId: string;
    wpm: number;
    accuracy: number;
    mistake: Mistake[];
}

const MistakeSchema = new mongoose.Schema<Mistake>(
    {
        index: { type: Number, required: true },
        correct: { type: String, required: true },
        wrong: { type: String, required: true },
    },
    { _id: false } // prevent mongoose from adding _id to each mistake entry
);

const TestSchema = new mongoose.Schema<Test>(
    {
        userId: {
            type: String,
            required: true,
        },
        wpm: {
            type: Number,
            required: true,
        },
        accuracy: {
            type: Number,
            required: true,
        },
        mistake: {
            type: [MistakeSchema],
            required: true,
        },
    },
    { timestamps: true }
);

const TestModel =
    (mongoose.models.Test as mongoose.Model<Test>) ||
    mongoose.model<Test>("Test", TestSchema);
export default TestModel;

export const getTestsByUserId = (userId: string) => {
    return TestModel.find({ userId: userId }).sort({ createdAt: -1 });
};

export const createTest = async (data: CreateTestInput) => {
    try {
        const test = new TestModel(data);
        return await test.save();
    } catch (err) {
        console.error("Failed to create test:", err);
        throw err;
    }
};
