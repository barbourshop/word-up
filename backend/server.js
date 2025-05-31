import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.resolve(__dirname, 'device-config.json');

app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Helper to read config
async function readConfig() {
  const data = await fs.readFile(CONFIG_PATH, 'utf-8');
  return JSON.parse(data);
}

// Helper to write config
async function writeConfig(config) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// POST /api/control: forward to device endpoint
app.post('/api/control', async (req, res) => {
  try {
    const { contentId, deviceId } = req.body;
    console.log('Received /api/control:', req.body);
    const config = await readConfig();
    const endpoint = config.deviceEndpoint;
    if (!endpoint) {
      console.error('Device endpoint not configured');
      return res.status(500).json({ error: 'Device endpoint not configured' });
    }
    // Forward the command to the device endpoint
    const deviceRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId, deviceId }),
    });
    const deviceData = await deviceRes.text();
    res.status(200).json({ status: 'forwarded', deviceResponse: deviceData });
  } catch (err) {
    console.error('Error in /api/control:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/device-config: get current config
app.get('/api/device-config', async (req, res) => {
  try {
    const config = await readConfig();
    res.json(config);
  } catch (err) {
    console.error('Error in /api/device-config (GET):', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/device-config: update config
app.post('/api/device-config', async (req, res) => {
  try {
    const { deviceName, deviceEndpoint } = req.body;
    if (!deviceName || !deviceEndpoint) {
      console.error('deviceName and deviceEndpoint required');
      return res.status(400).json({ error: 'deviceName and deviceEndpoint required' });
    }
    const config = { deviceName, deviceEndpoint };
    await writeConfig(config);
    res.json({ status: 'updated', config });
  } catch (err) {
    console.error('Error in /api/device-config (POST):', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`TV Remote backend running on http://localhost:${PORT}`);
}); 