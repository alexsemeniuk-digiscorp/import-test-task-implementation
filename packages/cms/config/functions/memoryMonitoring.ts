let intervalId: NodeJS.Timeout | null = null;

export const memoryMonitoring = (isMonitoring: boolean) => {
  if (isMonitoring) {
    if (!intervalId) {
      intervalId = setInterval(() => {
        const used = process.memoryUsage();
        console.log(`Memory Usage: ${Date.now()}
        RSS: ${Math.round(used.rss / 1024 / 1024)} MB
        Heap Total: ${Math.round(used.heapTotal / 1024 / 1024)} MB
        Heap Used: ${Math.round(used.heapUsed / 1024 / 1024)} MB
        External: ${Math.round(used.external / 1024 / 1024)} MB`);
      }, 5000);
    }
  } else if (intervalId) {
    console.log('cleared');
    clearInterval(intervalId);
    intervalId = null;
  }
};
