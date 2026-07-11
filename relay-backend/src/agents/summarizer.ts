import { MODEL, openai } from "../lib/openai";

const SYSTEM_PROMPT = `You are a summarization assistant. Given research text and instructions, 
produce a clear, concise summary that captures the key points. Remove redundancy. Keep it focused.`;

export async function runSummarizer(instructions: string, researchOuput: string): Promise<string> {
    const res = await openai.chat.completions.create({
        model: MODEL,
        messages: [{
            role: 'system',
            content: SYSTEM_PROMPT
        },
        {
            role: 'user',
            content: `Instructions: ${instructions}\n\nResearch to summarize:\n${researchOuput}`
        }
        ],
        temperature: 0.4
    })

    const output = res.choices[0]?.message?.content?.trim();
    if(!output) throw new Error('Summarizer returned an empty response');
    return output;
}
