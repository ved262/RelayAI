import { MODEL, openai } from "../lib/openai";
import { ISubTaskPlan } from "../types";

const SYSTEM_PROMPT = `You are a planning assistant. Given a user's goal, break it into exactly 3 subtasks for these agents, in this order: researcher, summarizer, writer.

Respond ONLY with valid JSON, no markdown formatting, no preamble. Use this exact shape:
[
  { "agent": "researcher", "instructions": "..." },
  { "agent": "summarizer", "instructions": "..." },
  { "agent": "writer", "instructions": "..." }
]`;

export async function generatePlan(goal: string): Promise<ISubTaskPlan[]>{
    const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: goal
            }
        ],
        temperature: 0.3
    });
    const raw = response.choices[0]?.message?.content?.trim();
    if(!raw){
        throw new Error('Orchestrator returned an empty response');
    }
    try{
        return JSON.parse(raw) as ISubTaskPlan[];
    }catch(err){
        throw new Error(`Orchestrator returned invalid JSON: ${raw}`);
    }

}