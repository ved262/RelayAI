# RelayAI

Give it a goal, watch AI agents relay it step by step — research, summarize, and write — until the job's done.

RelayAI is a multi-agent task automation system. A user submits a high-level goal; an **Orchestrator** agent breaks it into subtasks, and three specialized agents — **Researcher**, **Summarizer**, and **Writer** — execute them in sequence, handing their output forward like a relay. Progress streams to the frontend in real time via WebSockets.

---

## Demo

> _Add a screen recording or GIF here once deployed — this is the single highest-impact thing you can add to this README for a portfolio piece._

---

## Architecture

```
┌─────────────┐      HTTP (goal submit)      ┌──────────────┐
│   React     │ ────────────────────────────▶│   Express    │
│  Frontend   │                               │   Backend    │
│             │◀──────────────────────────────│              │
└─────────────┘      WebSocket (live events)  └──────┬───────┘
                                                       │
                                          ┌────────────┴────────────┐
                                          │   Pipeline Runner        │
                                          │                          │
                                          │  Orchestrator            │
                                          │       │                  │
                                          │       ▼                  │
                                          │  Researcher              │
                                          │       │                  │
                                          │       ▼                  │
                                          │  Summarizer               │
                                          │       │                  │
                                          │       ▼                  │
                                          │  Writer                  │
                                          └────────────┬────────────┘
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │  MongoDB    │
                                                 │   Atlas     │
                                                 └─────────────┘
```

This follows an **Orchestrator-Worker pattern**: a central planner decomposes a goal, and specialized workers execute subtasks in sequence, with each agent's output feeding the next. Agent selection is hardcoded for v1 (not dynamic), and agents run in-process as sequential function calls — not as independently deployed services communicating over a formal protocol like A2A. This is a deliberate MVP scope; see [Roadmap](#roadmap--v2) below.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas + Mongoose |
| AI | OpenAI GPT-4o-mini |
| Real-time | Socket.io |
| Frontend | React 19, TypeScript, Tailwind CSS |
| Markdown rendering | react-markdown + remark-gfm |
| Deployment | Render (backend), Vercel (frontend) |

---

## Features

- Submit a natural-language goal and watch it get decomposed into a 3-step plan
- Real-time agent progress via WebSockets — no polling
- Collapsible, auto-expanding result panels per agent, with proper Markdown rendering
- Full run history with the ability to revisit any past run's complete output
- All runs and intermediate agent outputs persisted to MongoDB, even if a run fails partway through

---

## Project Structure

```
relayai/
├── relay-backend/
│   ├── src/
│   │   ├── server.ts                  # Express + Socket.io entry point
│   │   ├── db.ts                      # MongoDB connection
│   │   ├── types/                     # Shared TypeScript interfaces
│   │   ├── models/Run.ts              # Mongoose schema
│   │   ├── lib/openai.ts              # OpenAI client config
│   │   ├── agents/                    # orchestrator, researcher, summarizer, writer
│   │   ├── controllers/runs.controller.ts  # REST handlers + socket wiring
│   │   ├── services/runPipeline.ts    # Chains agents, persists + emits progress
│   │   └── routes/runs.ts             # REST API routes
│   └── package.json
│
├── relay-frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api/                      # health.ts, runs.ts
│   │   ├── components/               # GoalInput, AgentTimeline, ResultPanel, RunHistory, etc.
│   │   ├── hooks/useSocket.ts        # Live run updates via WebSocket
│   │   ├── types/                    # Frontend TypeScript types
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (free tier is fine)
- An OpenAI API key

### Backend

```bash
cd relay-backend
npm install
cp .env.example .env   # fill in MONGODB_URI, OPENAI_API_KEY, FRONTEND_URL
npm run dev
```

Runs on `http://localhost:3000`. Confirm with `GET /api/health`.

### Frontend

```bash
cd relay-frontend
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
```

Runs on `http://localhost:5173`.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/runs` | Submit a goal and start the agent pipeline |
| GET | `/api/runs` | List the 50 most recent runs (summary fields only) |
| GET | `/api/runs/:id` | Get a specific run with full agent output and plan |
| GET | `/api/health` | Server health check |

## WebSocket Events

| Event | Direction | Payload |
|---|---|---|
| `join:run` | client → server | `runId` — joins the room for that run |
| `run:started` | server → client | `{ runId }` |
| `agent:started` | server → client | `{ agent }` |
| `agent:completed` | server → client | `{ agent, output }` |
| `run:completed` | server → client | `{ runId, finalResult }` |
| `run:failed` | server → client | `{ error }` |

---

## Known Limitations (v1)

Documented honestly, not glossed over:

- **The Researcher agent doesn't perform live web search.** It synthesizes from the LLM's own training knowledge, prompted to behave like a researcher. Real research capability would require a search tool integration (e.g., function calling to a search API) — planned for v2.
- **The Orchestrator's plan is prompted JSON, not schema-guaranteed.** It relies on the model following formatting instructions rather than OpenAI's native structured output mode. Occasionally fails on malformed JSON; the run is marked `failed` when this happens, with no automatic retry.
- **Pipeline execution is fire-and-forget, with no job queue.** If the server process restarts mid-run, that run is stuck `in_progress` permanently. A message queue (Kafka/RabbitMQ) is the correct production fix — see Roadmap.
- **No authentication.** All runs are publicly visible to anyone with access to the deployed URL. Not intended for sensitive data.
- **No pagination on run history** — capped at the 50 most recent runs.

---

## Roadmap — v2

- Dynamic agent selection based on goal type (not hardcoded to 3 fixed agents)
- Parallel agent execution where subtasks don't depend on each other
- Kafka/RabbitMQ for durable, retryable async task handling
- LangGraph for explicit orchestration state management
- Real search-tool integration for the Researcher agent
- Dockerized full stack, deployed on AWS with CI/CD via GitHub Actions
- Possible v3 exploration: re-architecting agents as independently deployed services communicating via a formal protocol (e.g., A2A), rather than in-process function calls

---

