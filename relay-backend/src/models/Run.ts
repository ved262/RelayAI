import { Schema, model } from "mongoose";
import { IAgentOutput, IRun, ISubTaskPlan } from "../types";

const agentOutputSchema = new Schema<IAgentOutput>({
    agent: {
        type: String,
        enum: ['researcher', 'summarizer', 'writer'],
        required: true
    },
    output: {
        type: String,
        required: true
    },
    completedAt: {
        type: Date
    }
}, { _id: false })

const subtaskPlanSchema = new Schema<ISubTaskPlan>({
    agent: {
        type: String,
        enum: ['researcher', 'summarizer', 'writer'],
        required: true
    },
    instructions: {
        type: String,
        required: true
    }
}, { _id: false })

const runSchema = new Schema<IRun>({
    goal: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'failed'],
        default: 'pending'
    },
    agentOutputs: {
        type: [agentOutputSchema],
        default: []
    },
    plan: {
        type: [subtaskPlanSchema],
        default: []
    },
    finalResult: {
        type: String
    }
}, { timestamps: true });

export const Run = model<IRun>('Run', runSchema)