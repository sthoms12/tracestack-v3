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
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up)
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
This will start the Vite development server for the React application and a local Wrangler server for the Hono backend. The application will be available at `http://localhost:3000`. The authentication flow is mocked in local development, using the email `dev.user@tracestack.local`.
## Authentication with Cloudflare Access
This application is designed to be protected by [Cloudflare Access](https://www.cloudflare.com/products/zero-trust/access/), which provides secure authentication for your applications without requiring you to manage user credentials.
### Setup Guide
Follow these steps to protect your deployed application:
1.  **Navigate to the Zero Trust Dashboard:**
    -   Log in to your Cloudflare account.
    -   From the main dashboard, select **Zero Trust** on the left-hand sidebar.
2.  **Add a Self-Hosted Application:**
    -   In the Zero Trust dashboard, go to **Access -> Applications**.
    -   Click **Add an application**.
    -   Select the **Self-hosted** option.
3.  **Configure the Application:**
    -   **Application name:** Choose a descriptive name (e.g., "TraceStack App").
    -   **Session Duration:** Set how long a user's session should last (e.g., "24 hours").
    -   **Application domain:** This is the most important step.
        -   **Domain:** Select the domain of your deployed worker (e.g., `your-worker-subdomain.workers.dev`).
        -   **Path:** Enter `app`. This will ensure that only routes under `/app/*` are protected.
    -   Scroll down to **Identity providers** and select the providers you want to allow (e.g., "Google", "GitHub", or "One-time PIN").
    -   Click **Next**.
4.  **Create an Access Policy:**
    -   **Policy name:** Give your policy a name (e.g., "Allow My Team").
    -   **Action:** Set to **Allow**.
    -   **Configure rules:** Create a rule to define who can access the application. For personal use, you can create a rule with the "Emails" selector and add your own email address.
    -   Click **Next**.
5.  **Finalize Setup:**
    -   Review your configuration.
    -   Click **Add application**.
Your application is now protected! When a user navigates to `https://your-worker-subdomain.workers.dev/app`, they will be prompted to log in with the identity provider you configured. Once authenticated, Cloudflare Access will securely forward their identity (email) to the application in the `Cf-Access-Jwt-Assertion` header.
## Deployment to Cloudflare Free Tier
This project is designed for easy deployment to Cloudflare's serverless platform.
### 1. Prerequisites
Ensure you have the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and configured.
```sh
bun install -g wrangler
```
### 2. Authenticate Wrangler
Log in to your Cloudflare account. This will open a browser window for you to authorize Wrangler.
```sh
wrangler login
```
### 3. Build the Project
This command compiles the frontend React application and the backend worker code into a production-ready format.
```sh
bun run build
```
### 4. Deploy to Cloudflare
This command uploads your built application to the Cloudflare network.
```sh
bun run deploy
```
Wrangler will output the URL of your deployed application (e.g., `https://tracestack-....workers.dev`).
### 5. Post-Deployment
After deploying, follow the **Authentication with Cloudflare Access** guide above to secure your application.
## Project Structure
The project is organized into three main directories:
-   `src/`: Contains the frontend React application source code.
-   `worker/`: Contains the backend Hono application that runs on Cloudflare Workers.
-   `shared/`: Contains TypeScript types that are shared between the frontend and backend.
## License
This project is licensed under the MIT License.