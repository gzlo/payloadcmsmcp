// Script to keep the Redis connection alive by pinging the keep-alive endpoint
(function() {
  // Configuration
  const PING_INTERVAL = 15000; // 15 seconds
  const KEEP_ALIVE_URL = '/api/keep-alive';
  const MAX_CONSECUTIVE_FAILURES = 3;
  
  let consecutiveFailures = 0;
  let lastPingTime = 0;
  let isActive = true;
  
  // Function to ping the keep-alive endpoint
  async function pingKeepAlive() {
    if (!isActive) return;
    
    try {
      const now = Date.now();
      const timeSinceLastPing = lastPingTime ? now - lastPingTime : 0;
      lastPingTime = now;
      
      console.log(`Pinging keep-alive endpoint. Time since last ping: ${timeSinceLastPing}ms`);
      
      const response = await fetch(KEEP_ALIVE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Keep-alive response:', data);
      
      // Reset failure counter on success
      consecutiveFailures = 0;
      
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
      consecutiveFailures++;
      
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.warn(`${MAX_CONSECUTIVE_FAILURES} consecutive failures. Increasing ping frequency.`);
        // If we're having trouble, ping more frequently
        setTimeout(pingKeepAlive, PING_INTERVAL / 2);
      }
    }
    
    // Schedule next ping
    setTimeout(pingKeepAlive, PING_INTERVAL);
  }
  
  // Start pinging when the page loads
  window.addEventListener('load', () => {
    console.log('Starting keep-alive pings...');
    pingKeepAlive();
  });
  
  // Pause pinging when the page is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      console.log('Page hidden, pausing keep-alive pings');
      isActive = false;
    } else {
      console.log('Page visible, resuming keep-alive pings');
      isActive = true;
      // Ping immediately when becoming visible again
      pingKeepAlive();
    }
  });
  
  // Also ping on user interaction to ensure activity
  ['click', 'keydown', 'mousemove', 'touchstart'].forEach(eventType => {
    document.addEventListener(eventType, () => {
      // Only ping if it's been at least half the interval since the last ping
      const now = Date.now();
      if (now - lastPingTime > PING_INTERVAL / 2) {
        pingKeepAlive();
      }
    }, { passive: true });
  });
})(); 