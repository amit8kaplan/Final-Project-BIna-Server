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
    
    // Immediately send all sessions to all connected clients when a new client connects
    sendAllSessionsToClients();

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  let previousSessions = new Map<string, any>();

  const BATCH_SIZE = 100; // Define the batch size
  const THRESHOLD_TTL = 60; // Threshold for sessions that are 60 seconds away from ending

  // Function to send all sessions to all connected clients
  const sendAllSessionsToClients = async () => {
    try {
      const keys = await redisClient.keys('session:*');
      const allSessions = [];

      for (let i = 0; i < keys.length; i += BATCH_SIZE) {
        const batchKeys = keys.slice(i, i + BATCH_SIZE);

        const batchPromises = batchKeys.map(async (key) => {
          const sessionData = await redisClient.get(key);
          const ttl = await redisClient.ttl(key);
          if (sessionData && !key.startsWith('sessionTemp:')) { // Ignore temporary sessions
            const parsedData = JSON.parse(sessionData);
            delete parsedData.storedOtp; // Remove the otp field
            allSessions.push({ key, ...parsedData, ttl });
          }
        });

        await Promise.all(batchPromises);
      }

      // Send all sessions to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ allSessions }));
        }
      });
    } catch (err) {
      console.error('Failed to retrieve and send all sessions:', err);
    }
  };

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
          const ttl = await redisClient.ttl(key);
          if (sessionData && !key.startsWith('sessionTemp:')) { // Exclude temporary sessions
            const parsedData = JSON.parse(sessionData);
            delete parsedData.storedOtp;
            currentSessions.set(key, { data: parsedData, ttl });
          }
        });
  
        await Promise.all(batchPromises);
      }

      // Identify new sessions and sessions close to ending
      const newSessions = [];
      const sessionsCloseToEnding = [];
      currentSessions.forEach((value, key) => {
        if (!previousSessions.has(key)) {
          newSessions.push({ key, ...value.data, ttl: value.ttl });
        }
        if (value.ttl <= THRESHOLD_TTL) {
          sessionsCloseToEnding.push({ key, ...value.data, ttl: value.ttl });
        }
      });

      // Notify all clients with new sessions if there are any
      if (newSessions.length > 0 || sessionsCloseToEnding.length > 0) {
        sendAllSessionsToClients();
      }

      // Update the previous state of sessions
      previousSessions = currentSessions;
    } catch (err) {
      console.error('Failed to retrieve sessions:', err);
    }
  }, 5000); // Check every 5 seconds
});
