# DocuMind

DocuMind is a RAG (Retrieval-Augmented Generation) system that enables you to chat with your documentation. It ingests content from a provided URL, indexes it, and allows you to ask natural language questions to receive context-aware answers.

![DocuMind UI](https://documind-mu.vercel.app/)

## Features

- **RAG Architecture**: Retrieves relevant context from documentation to prevent hallucinations.
- **URL Ingestion**: Scrapes and processes content directly from documentation websites.
- **Semantic Search**: Uses local embeddings (`@xenova/transformers`) for fast, private vector search.
- **Smart Answers**: Integrates with Groq (Llama 3 70B) for fast and accurate responses.
- **Responsive UI**: Clean interface with dark mode support.
- **Serverless Ready**: Optimized for deployment on platforms like Vercel.

## Tech Stack

**Frontend**
- React (Vite)
- Vanilla CSS
- Lucide React

**Backend**
- Node.js & Express
- @xenova/transformers (Local embeddings)
- Cheerio (Web scraping)
- Groq SDK (LLM inference)
- In-Memory Vector Store

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A [Groq Cloud](https://console.groq.com/) API Key

### Installation

1. **Clone the repository**

2. **Backend Setup**
   
   Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3000
   ```
   
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   
   Open a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

   Start the frontend:
   ```bash
   npm run dev
   ```

4. **Usage**
   Visit `http://localhost:5173` in your browser.

## Deployment

### Vercel

This project is configured for Vercel deployment.

1. **Push to GitHub**: Ensure your code is in a GitHub repository.
2. **Import to Vercel**: Import the repository in Vercel.
3. **Environment Variables**:
   - Add `GROQ_API_KEY` to the Vercel project settings.
   - Configure `VITE_API_BASE_URL` if necessary (Vercel automatic URL handling usually works, you may need to set the production backend URL).
4. **Deploy**: Vercel will detect `vercel.json` and deploy both the frontend and backend.

## Architecture

1. **Ingest**: The backend scrapes text from the URL, chunks it, generates embeddings, and stores them in memory.
2. **Query**: The backend generates an embedding for the question, finds the top similar chunks, and sends the context + question to the Groq LLM.
3. **Response**: The LLM generates an answer based strictly on the provided context.

## License

MIT