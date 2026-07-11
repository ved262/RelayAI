import { Server } from "socket.io";
import { generatePlan } from "../agents/orchestrator";
import { runResearcher } from "../agents/researcher";
import { runSummarizer } from "../agents/summarizer";
import { runWriter } from "../agents/writer";
import { Run } from "../models/Run";

export async function runPipeline(runId: string, io: Server) {
    try {
        const run = await Run.findById(runId);
        if (!run) throw new Error(`Run ${runId} not found`)

        run.status = 'in_progress'
        await run.save();
        io.to(runId).emit('run:started', { runId });

        const plan = await generatePlan(run.goal);
        run.plan = plan;
        run.save();

        const researcherTask = plan.find((p) => p.agent === 'researcher');
        const summaryTask = plan.find((p) => p.agent === 'summarizer');
        const writerTask = plan.find((p) => p.agent === 'writer');
        if (!researcherTask || !summaryTask || !writerTask) throw new Error('Plan is missing one or more required agent subtasks');

        io.to(runId).emit('agent:started', { agent: 'researcher' });
        const researcherOutput = await runResearcher(researcherTask.instructions);
        run.agentOutputs.push({
            agent: 'researcher',
            output: researcherOutput,
            completedAt: new Date()
        })
        await run.save();
        io.to(runId).emit('agent:completed', { agent: 'researcher', output: researcherOutput });


        io.to(runId).emit('agent:started', { agent: 'summarizer' });
        const summaryOutput = await runSummarizer(summaryTask.instructions, researcherOutput);
        run.agentOutputs.push({
            agent: 'summarizer',
            output: summaryOutput,
            completedAt: new Date()
        });
        await run.save();
        io.to(runId).emit('agent:completed', { agent: 'summarizer', output: summaryOutput });

        io.to(runId).emit('agent:started', { agent: 'writer' });
        const writerOutput = await runWriter(writerTask.instructions, summaryOutput);
        run.agentOutputs.push({
            agent: 'writer',
            output: writerOutput,
            completedAt: new Date()
        })

        run.finalResult = writerOutput;
        run.status = 'completed'
        await run.save();
        io.to(runId).emit('agent:completed', { agent: 'writer', output: writerOutput });

        io.to(runId).emit('run:completed', { runId, finalResult: writerOutput });
        io.socketsLeave(runId);

    } catch (err) {
        console.error(`Pipeline failed for run ${runId}:`, err);
        await Run.findByIdAndUpdate(runId, { status: 'failed' });
        io.to(runId).emit('run:failed', { error: (err as Error).message});
        io.socketsLeave(runId);
    }
}