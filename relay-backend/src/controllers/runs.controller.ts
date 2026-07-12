import { NextFunction, Request, Response } from "express"
import { IApiError } from "../types";
import { Run } from "../models/Run";
import { runPipeline } from "../services/runPipeline";
import { Server } from "socket.io";

let ioInstance: Server;
export function setSocketServer(io: Server) {
    ioInstance = io;
}

export const createRun = async (req: Request, res: Response) => {
    const { goal } = req.body;
    if (!goal || typeof goal !== 'string' || !goal.trim()) {
        return res.status(400).json({ error: 'A non-empty "goal" string is required' } as IApiError);
    }

    try {
        const run = await Run.create({ goal: goal.trim() });
        runPipeline(run._id.toString(), ioInstance);
        return res.status(201).json(run);
    } catch (error) {
        console.error('Failed to create run: ', error);
        res.status(500).json({ error: 'Failed to create run.' } as IApiError);
    }
}


export const getRunById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const runId = req.params.id;
        const run = await Run.findById(runId);
        if (!run) {
            return res.status(404).json({ error: "Run not found" } as IApiError);
        }
        return res.status(200).json(run)
    } catch (error) {
        console.error('Failed to fetch run: ', error);
        return res.status(500).json({ error: 'Failed to fetch run.' } as IApiError)
    }
}


export const getRuns = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const runs = await Run.find().select('goal status finalResult createAt updatedAt').sort({ createdAt: -1 }).limit(50);
        return res.status(200).json(runs);
    } catch (err) {
        console.error('Failed to fetch runs: ', err);
        return res.status(500).json({ error: 'Failed to fetch runs.' } as IApiError)
    }
}