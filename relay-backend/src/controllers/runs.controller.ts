import { Request, Response } from "express"
import { IApiError } from "../types";
import { Run } from "../models/Run";

export const createRun = async(req: Request, res: Response) => {
    const { goal } = req.body;
    if(!goal || typeof goal !== 'string' || !goal.trim() ){
        return res.status(400).json({ error: 'A non-empty "goal" string is required' } as IApiError);
    }

    try {
        const run = await Run.create({ goal: goal.trim() });
        return res.status(201).json(run);
    } catch (error) {
        console.error('Failed to create run: ', error);
        res.status(500).json({ error: 'Failed to create run.'} as IApiError);
    }
}