# DocuMind 🧠

DocuMind is an intelligent RAG (Retrieval-Augmented Generation) system that allows you to chat with your documentation. Simply parse a documentation URL, and DocuMind will ingest the content, index it, and let you ask natural language questions to get accurate, context-aware answers.

![DocuMind UI] (https://documind-mu.vercel.app/)

## ✨ Features

- **🚀 RAG Architecture**: Retrieves relevant context from documentation to prevent AI hallucinations.
- **🌐 URL Ingestion**: Scrapes and processes content directly from documentation websites.
- **🔍 Semantic Search**: Uses local embeddings (`@xenova/transformers`) for fast, private vector search.
- **🤖 Smart Answers**: Integrates with **Groq** (Llama 3 70B) for lightning-fast, accurate responses.
- **💎 Premium UI**: Glassmorphism design with responsive animations and dark mode aesthetics.
- **⚡ Serverless Ready**: Optimized for deployment on Vercel.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Fast, modern UI library.
- **Vanilla CSS**: Custom glassmorphism implementation (no external UI libs required).
- **Lucide React**: Beautiful icons.

### Backend
- **Node.js & Express**: API server.
- **@xenova/transformers**: In-process embedding generation (MiniLM-L6-v2).
- **Cheerio**: Robust web scraping.
- **Groq SDK**: High-performance LLM inference.
- **In-Memory Vector Store**: Simple, efficient similarity search for small-to-medium docs.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A [Groq Cloud](https://console.groq.com/) API Key

   
2. **Setup Backend**
   
   cd backend
   npm install
   
   Create a `.env` file in the `backend` directory:
   
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3000
   
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   Open a new terminal:
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

4. **Open the App**
   Visit `http://localhost:5173` in your browser.

## 📦 Deployment

### Vercel (Frontend & Backend)

This project is configured for seamless deployment on Vercel.

1. **Push to GitHub**: Ensure your code is in a GitHub repository.
2. **Import to Vercel**: Import the repo in Vercel.
3. **Environment Variables**:
   - Add `GROQ_API_KEY` to the Vercel project settings.
   - For the frontend to talk to the backend, you might need to configure the `VITE_API_BASE_URL` to your deployed backend URL.
4. **Deploy**: Vercel will automatically detect the configuration in `vercel.json` and deploy both the static frontend and serverless backend.

## 🔧 Architecture

1. **Ingest**: User provides a URL -> Backend scrapes text -> Chunks text -> Generates Embeddings -> Stores in Vector Store.
2. **Query**: User asks question -> Backend generates query embedding -> Finds top K similar chunks -> Sends context + question to Groq LLM.
3. **Response**: LLM generates answer based *only* on the provided context.

## 📄 License

MIT