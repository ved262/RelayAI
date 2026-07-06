import { Schema, model } from "mongoose";
import { IAgentOutput, IRun } from "../types";

const agentOutputSchema = new Schema<IAgentOutput>({
    agent: {
        type: String,
        enum: ['reasearcher','summarizer','writer'],
        required: true 
    },
    output: {
        type: String,
        required: true
    },
    completedAt: {
        type: Date
    }
}, { _id: false})

const runSchema = new Schema<IRun>({
    goal: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'complete', 'failed'],
        default: 'pending'
    },
    agentOutputs: {
        type: [agentOutputSchema],
        default: []
    },
    finalResult: {
        type: String
    }
}, { timestamps: true });

export const Run = model<IRun>('Run', runSchema)