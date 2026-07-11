import { generatePlan } from "../agents/orchestrator";
import { runResearcher } from "../agents/researcher";
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
        if(!researcherTask) throw new Error('No researcher subtask in plan')

        const researcherOutput = await runResearcher(researcherTask.instructions);
        run.agentOutputs.push({
            agent: 'researcher',
            output: researcherOutput,
            completedAt: new Date()
        })
        await run.save();

    } catch (err) {
        console.error(`Pipeline failed for run ${runId}:`, err);
        await Run.findByIdAndUpdate(runId, { status: 'failed' });
    }
}