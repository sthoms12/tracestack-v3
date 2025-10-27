# tracestack

A troubleshooting session management application for solo developers to organize and resolve technical issues with structured, multi-view workflows.

[cloudflarebutton]

TraceStack is a specialized troubleshooting session management application designed for solo developers. It provides a structured environment to systematically track, organize, and resolve technical issues. The core principle is to transform chaotic debugging into a productive, documented process. It features multiple, distinct workflow views for each session—Timeline for chronological events, Kanban for task-based progress, Raw Notes for unstructured thoughts, and a Brainstorming canvas for visual mapping. This adaptability caters to different cognitive styles of problem-solving. By capturing every step, hypothesis, and discovery, TraceStack builds a searchable knowledge base, making past solutions easily accessible and preventing developers from solving the same problem twice. It aims to be an indispensable tool that brings clarity, order, and efficiency to the often-frustrating art of debugging.

## Key Features

-   **Structured Session Management**: Create, track, and manage troubleshooting sessions from start to finish.
-   **Multi-View Workflows**: Switch between Timeline, Kanban, Raw Notes, and Brainstorming views to suit your problem-solving style.
-   **Knowledge Base**: Every session contributes to a searchable history, preventing you from solving the same problem twice.
-   **Insightful Dashboard**: Get a quick overview of your sessions with stats for active, resolved, blocked, and archived issues.
-   **Powerful Filtering & Search**: Quickly find sessions and entries using comprehensive search and filtering options.
-   **Analytics**: Visualize your troubleshooting performance with charts on resolution times and issue frequency.
-   **AI Assistant (Stubbed)**: A foundation for a future AI-powered assistant to query your knowledge base.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **UI Components**: shadcn/ui, Radix UI
-   **Backend**: Hono on Cloudflare Workers
-   **Data Persistence**: Cloudflare Durable Objects
-   **State Management**: Zustand (Client), TanStack Query (Server)
-   **Routing**: React Router
-   **Forms**: React Hook Form with Zod for validation
-   **Icons & Animation**: Lucide React, Framer Motion
-   **Charts**: Recharts

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/tracestack.git
    cd tracestack
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running in Development Mode

To start the development server for both the frontend and the worker, run:

```sh
bun dev
```

This will start the Vite development server for the React application and a local Wrangler server for the Hono backend. The application will be available at `http://localhost:3000`.

## Project Structure

The project is organized into three main directories:

-   `src/`: Contains the frontend React application source code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components.
    -   `lib/`: Utility functions and API client.
    -   `hooks/`: Custom React hooks.
-   `worker/`: Contains the backend Hono application that runs on Cloudflare Workers.
    -   `index.ts`: The entry point for the worker.
    -   `user-routes.ts`: Where API routes are defined.
    -   `entities.ts`: Data models and logic for interacting with Durable Objects.
-   `shared/`: Contains TypeScript types that are shared between the frontend and backend.

## Development

### Backend

To add a new API endpoint, open `worker/user-routes.ts` and add a new route handler using Hono's syntax. For data persistence, create or modify entity classes in `worker/entities.ts` which abstract the interaction with the `GlobalDurableObject`.

### Frontend

The frontend is a standard Vite + React application. Create new pages in `src/pages` and add them to the router in `src/main.tsx`. Reusable components should be placed in `src/components`. To interact with the backend, use the pre-configured `api` client in `src/lib/api-client.ts`.

## Deployment

This project is designed for easy deployment to Cloudflare Pages.

### One-Click Deploy

You can deploy this application to your own Cloudflare account with a single click.

[cloudflarebutton]

### Manual Deployment with Wrangler

1.  **Build the project:**
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    ```sh
    bun run deploy
    ```

This command will build the frontend application and deploy both the static assets and the worker function to Cloudflare.

## License

This project is licensed under the MIT License.