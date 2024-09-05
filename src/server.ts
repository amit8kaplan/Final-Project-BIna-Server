import initApp from "./app";
import https from 'https';
import http from 'http';
import fs from 'fs';
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { WebSocketServer } from 'ws';
import { redisClient } from './app';

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

initApp().then((app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Advanced Application development 2023 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT and refresh token - Creators: Amit Kaplan & Matan Azarzar",
      },
      servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  let server;
  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } else {
    console.log('PRODUCTION');
    const options2 = {
      key: fs.readFileSync('../client-key.pem'),
      cert: fs.readFileSync('../client-cert.pem')
    };
    server = https.createServer(options2, app);
    server.listen(HTTPS_PORT, () => {
      console.log(`Server is running on port ${HTTPS_PORT}`);
    });
  }

  // Set up WebSocket server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Track the previous state of sessions
  let previousSessions = new Map<string, any>();

  const BATCH_SIZE = 100; // Define the batch size

  setInterval(async () => {
    try {
      // Only perform checks if there are active WebSocket connections
      if (wss.clients.size === 0) {
        return;
      }
  
      const keys = await redisClient.keys('session:*');
      const currentSessions = new Map<string, any>();
  
      // Process sessions in batches
      for (let i = 0; i < keys.length; i += BATCH_SIZE) {
        const batchKeys = keys.slice(i, i + BATCH_SIZE);
  
        const batchPromises = batchKeys.map(async (key) => {
          const sessionData = await redisClient.get(key);
          const ttl = await redisClient.ttl(key); // Get the remaining TTL for the session
          if (sessionData) {
            const parsedData = JSON.parse(sessionData);
            delete parsedData.storedOtp; // Remove the otp field
            currentSessions.set(key, { data: parsedData, ttl });
          }
        });
  
        await Promise.all(batchPromises); // Wait for all promises in the batch to resolve
      }
  
      // Collect all sessions without the otp field
      const allSessions = [];
      currentSessions.forEach((value, key) => {
        allSessions.push({ key, ...value.data, ttl: value.ttl });
      });
  
      // Notify all connected clients with all sessions
      if (allSessions.length > 0) {
        wss.clients.forEach(client => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(allSessions));
          }
        });
      }
  
      // Update the previous state of sessions
      previousSessions = currentSessions;
    } catch (err) {
      console.error('Failed to retrieve sessions:', err);
    }
  }, 60000); // Check every 60 seconds
});