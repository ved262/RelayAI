import { generatePlan } from "../agents/orchestrator";
import { runResearcher } from "../agents/researcher";
import { runSummarizer } from "../agents/summarizer";
import { runWriter } from "../agents/writer";
import { Run } from "../models/Run";

export async function runPipeline(runId: string) {
    try {
        const run = await Run.findById(runId);
        if(!run) throw new Error(`Run ${runId} not found`)
        
        run.status = 'in_progress'
        await run.save();

        const plan = await generatePlan(run.goal);
        run.plan = plan;
        run.save();

        const researcherTask = plan.find((p)=> p.agent === 'researcher');
        const summaryTask = plan.find((p)=> p.agent === 'summarizer');
        const writerTask = plan.find((p)=> p.agent === 'writer');
        if(!researcherTask || !summaryTask || !writerTask) throw new Error('Plan is missing one or more required agent subtasks');

        const researcherOutput = await runResearcher(researcherTask.instructions);
        run.agentOutputs.push({
            agent: 'researcher',
            output: researcherOutput,
            completedAt: new Date()
        })
        await run.save();

        
        const summaryOutput = await runSummarizer(summaryTask.instructions, researcherOutput);
        run.agentOutputs.push({
            agent: 'summarizer',
            output: summaryOutput,
            completedAt: new Date()
        });
        await run.save();

        const writerOutput = await runWriter(writerTask.instructions, summaryOutput);
        run.agentOutputs.push({
            agent: 'writer',
            output: writerOutput,
            completedAt: new Date()
        })

        run.finalResult = writerOutput;
        run.status = 'completed'
        await run.save();

    } catch (err) {
        console.error(`Pipeline failed for run ${runId}:`, err);
        await Run.findByIdAndUpdate(runId, { status: 'failed' });
    }
}