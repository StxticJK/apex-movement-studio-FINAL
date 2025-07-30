// Vercel serverless function for settings API

// Default settings
let userSettings = {
  id: 'default-settings',
  defaultKeyBindings: {
    jump: 'Space',
    crouch: 'Ctrl',
    forward: 'W',
    backward: 'S',
    left: 'A',
    right: 'D',
  },
  exportFormat: 'autohotkey',
  scriptDirectory: null,
};

export default function handler(req, res) {
  const { method } = req;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    switch (method) {
      case 'GET':
        return res.json(userSettings);
        
      case 'PUT':
        userSettings = {
          ...userSettings,
          ...req.body,
          exportFormat: req.body.exportFormat || null,
          scriptDirectory: req.body.scriptDirectory || null,
        };
        return res.json(userSettings);
        
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Settings API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}