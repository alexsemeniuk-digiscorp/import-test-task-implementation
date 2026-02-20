import { LifecycleHook } from '../types';

import { handleLogger } from '../../../graphql/helpers/errors';

import { addTenantToPlan } from './afterCreate/addTenantToPlan';
import { createCustomPermissions } from './afterCreate/createCustomPermissions';
import { createDefaultPaymentMethods } from './afterCreate/createDefaultPaymentMethods';
import { createDefaultSettings } from './afterCreate/createDefaultSettings';
import { createOnboarding } from './afterCreate/createOnboarding';
import { createUsage } from './afterCreate/createUsage';
import { createInputsOptions } from './createInputsOptions';

export const afterCreateLifecycleHook: LifecycleHook = async ({ result }) => {
  handleLogger(
    'info',
    'Tenant AfterCreateLifecycleHook',
    `Params:${JSON.stringify(result)}`,
  );

  const tenantId = result.id;

  if (tenantId) {
    await addTenantToPlan(tenantId);
    await createDefaultSettings(tenantId);
    await createOnboarding(tenantId);
    await createCustomPermissions(tenantId);
    await createInputsOptions(tenantId);
    await createDefaultPaymentMethods(tenantId);
    await createUsage(tenantId);
  }
};
