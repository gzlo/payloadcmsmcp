import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureRedisConnection } from '../lib/redis-connection';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure Redis connection is established
    const isConnected = await ensureRedisConnection();
    
    res.status(200).json({
      status: isConnected ? 'ok' : 'redis_disconnected',
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
} 