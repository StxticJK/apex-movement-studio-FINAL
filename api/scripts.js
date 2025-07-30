// Vercel serverless function for scripts API
import { scriptTemplates } from '../client/src/lib/script-templates.js';

// In-memory storage for Vercel (resets on each deployment)
let scripts = [];
let initialized = false;

function initializeScripts() {
  if (!initialized) {
    scripts = scriptTemplates.map((template, index) => ({
      ...template,
      id: `template-${index}`,
      createdAt: new Date().toISOString(),
      isTemplate: true,
    }));
    initialized = true;
  }
}

export default function handler(req, res) {
  initializeScripts();
  
  const { method, query } = req;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    switch (method) {
      case 'GET':
        if (query.templates === 'true') {
          return res.json(scripts.filter(s => s.isTemplate === true));
        }
        return res.json(scripts);
        
      case 'POST':
        const newScript = {
          ...req.body,
          id: `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          isTemplate: false,
          description: req.body.description || null,
        };
        scripts.push(newScript);
        return res.json(newScript);
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}