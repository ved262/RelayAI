import { MODEL, openai } from "../lib/openai"

const SYSTEM_PROMPT = `You are a research assistant. Given instructions, provide a thorough, factual research summary based on your knowledge. Be specific and organized. Do not fabricate sources or citations.`

export async function runResearcher(instructions: string): Promise<string> {
    const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{
            role: 'system',
            content: SYSTEM_PROMPT
        },
        {
            role: 'user',
            content: instructions
        }
        ],
        temperature: 0.4
    })

    const output = response.choices[0]?.message?.content?.trim();
    if(!output){
        throw new Error('Researcher returned an empty response');
    }
    return output;
}

