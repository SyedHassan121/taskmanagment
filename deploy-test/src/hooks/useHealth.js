import { useState, useEffect, useCallback } from 'react';
import { healthService } from '../services/healthService';

export function useHealth() {
  const [health, setHealth] = useState({
    server: 'checking', // 'checking' | 'online' | 'offline'
    database: 'checking', // 'checking' | 'connected' | 'disconnected' | 'offline'
    message: '',
    dbError: null,
  });
  const [checking, setChecking] = useState(false);

  const checkHealthStatus = useCallback(async () => {
    setChecking(true);
    try {
      const data = await healthService.checkHealth();
      setHealth({
        server: 'online',
        database: data?.database?.status || 'disconnected',
        message: data?.message || 'Server OK',
        dbError: data?.database?.error || null,
      });
    } catch (err) {
      setHealth({
        server: 'offline',
        database: 'offline',
        message: 'Could not connect to backend server',
        dbError: err.message,
      });
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealthStatus();
  }, [checkHealthStatus]);

  return {
    health,
    checking,
    checkHealthStatus,
  };
}
