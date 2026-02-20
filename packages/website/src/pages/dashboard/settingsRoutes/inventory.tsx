import SettingModuleFactory from '@components/dashboard/dashboardSettings/SettingsModuleFactory/SettingModuleFactory';
import { SettingsFactory } from '@components/dashboard/dashboardSettings/types/types';
import { ROUTES } from '@router/routes';
import { Outlet, useLocation } from 'react-router-dom';

const { inventoryImport } = ROUTES.tenant.dashboard.settings.inventorySettings;

const INVENTORY_SETTINGS_FACTORY: SettingsFactory = {
  importSection: {
    importPath: inventoryImport,
    title: 'Import Products from a CSV',
    description:
      'Allows users to import products information stored in CSV to the platform',
    isCapitalize: false,
  },
};

const Inventory = () => {
  const { pathname } = useLocation();
  const showOutlet = pathname.includes(inventoryImport);

  if (showOutlet) {
    return <Outlet />;
  }
  return (
    <>
      <SettingModuleFactory settingsFactory={INVENTORY_SETTINGS_FACTORY} />
    </>
  );
};

export default Inventory;
