// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import axios from 'axios';
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

// import { DirectoryLoader } from "langchain/document_loaders/fs/directory";

// import { ChatOpenAI } from "@langchain/openai";
// import { HumanMessage, SystemMessage } from "@langchain/core/messages";


// const promptTemplate = new ChatPromptTemplate({
//     systemMessage: new SystemMessage({}),
//     humanMessage: new HumanMessage({}),
//     outputParser: new StringOutputParser({})
// });

// // Load environment variables
// dotenv.config();
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// const model = new ChatOpenAI({openAIApiKey: OPENAI_API_KEY, model: "gpt-4" });

// const loadDocs = async () => {
//     const loader = new DirectoryLoader('data', { glob: '**/*.txt' });
//     return loader.load();
// };

// // Extract text content from documents
// const getDocsContent = async () => {
//     const docs = await loadDocs();
//     return docs.map(doc => doc.pageContent).join('\n');
// };
// export async function chat(req: Request, res: Response) {
//     try{
//         const question = req.body.question;
//         console.log("question", question);

//     }