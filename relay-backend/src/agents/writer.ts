import { MODEL, openai } from "../lib/openai"

const SYSTEM_PROMPT = `You are a writing assistant. Given a summary and instructions, 
produce a well-written, polished final piece suitable for sharing. Use clear structure and natural tone.`

export async function runWriter(instructions: string, summaryOutput: string): Promise<string> {
    const res = await openai.chat.completions.create({
        model: MODEL,
        messages: [{
            role: 'user',
            content: SYSTEM_PROMPT
        },
        {
            role: 'user',
            content: `Instructions: ${instructions}\n\nSummary to write from:\n${summaryOutput}`
        }
        ],
        temperature: 0.7
    })

    const output = res.choices[0]?.message?.content?.trim();
    if(!output) throw new Error('Writer returned an empty response');
    return output;
}