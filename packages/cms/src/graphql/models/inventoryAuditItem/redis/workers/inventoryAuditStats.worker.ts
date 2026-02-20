import { Job } from 'bullmq';

interface Stats {
  all: number;
  notScanned: number;
  scanned: number;
  partial: number;
  over: number;
  progress: string;
}

export const inventoryAuditStatsProccessor = async (job: Job) => {
  const { items } = job.data;

  const result: Stats = {
    all: items.length,
    notScanned: items.filter(
      (item) => item.scannedQty === 0 && item.actualQty === 0,
    ).length,
    scanned: items.filter((item) => {
      const { scannedQty, actualQty, inventoryQty } = item;
      if (scannedQty <= 0 && actualQty <= 0) return false;
      if (scannedQty > 0 && scannedQty === inventoryQty) return true;
      if (actualQty > 0 && actualQty === inventoryQty) return true;
      return false;
    }).length,
    partial: items.filter((item) => {
      const { scannedQty, actualQty, inventoryQty } = item;
      if (scannedQty <= 0 && actualQty <= 0) return false;
      if (scannedQty > 0 && scannedQty < inventoryQty) return true;
      if (actualQty > 0 && actualQty < inventoryQty) return true;
      return false;
    }).length,
    over: items.filter(
      (item) =>
        (item.scannedQty > 0 && item.scannedQty > item.inventoryQty) ||
        (item.actualQty > 0 && item.actualQty > item.inventoryQty),
    ).length,
    progress: '0',
  };

  const { totalQty, scannedQty } = items.reduce(
    (acc, item) => {
      acc.totalQty += item.inventoryQty || 0;
      acc.scannedQty += Math.max(item.scannedQty || 0, item.actualQty || 0);
      return acc;
    },
    { totalQty: 0, scannedQty: 0 },
  );

  const progress =
    totalQty > 0 ? ((scannedQty / totalQty) * 100).toFixed(0) : '0';

  result.progress = progress;

  return result;
};
