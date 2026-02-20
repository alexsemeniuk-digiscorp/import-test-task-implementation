import { FC, lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import { ROUTES } from '@router/routes';

const InventoryImport = lazy<FC>(
  () => import('@pages/dashboard/settingsRoutes/inventoryPages/productsImport'),
);

const { index } = ROUTES.tenant.dashboard;

export const dashboardRoutes: RouteObject = {
  Component: InventoryImport,
  path: index,
};
