import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 5001;
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'AetherChess', port: PORT });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('[Bridge] Client connected via WebSocket');
  ws.send(JSON.stringify({ type: 'connected', message: 'AetherChess UCI Bridge ready' }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('[Bridge] Received message:', data.type);
    } catch (err) {
      console.error('[Bridge] Error parsing client message:', err);
    }
  });

  ws.on('close', () => {
    console.log('[Bridge] Client disconnected');
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Bridge] UCI Bridge server listening on http://0.0.0.0:${PORT}`);
});
