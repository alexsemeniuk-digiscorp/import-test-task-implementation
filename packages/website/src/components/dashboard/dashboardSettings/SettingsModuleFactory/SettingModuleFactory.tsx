import ImportSection from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/ImportSection';
import { SettingsFactory } from '@components/dashboard/dashboardSettings/types/types';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

interface Props {
  settingsFactory: SettingsFactory;
}

const SettingModuleFactory: React.FC<Props> = ({ settingsFactory }) => {
  const { pathname } = useLocation();
  const showOutlet = pathname.includes(
    settingsFactory.importSection.importPath,
  );

  if (showOutlet) {
    return <Outlet />;
  }

  return <ImportSection {...settingsFactory.importSection} />;
};

export default SettingModuleFactory;
