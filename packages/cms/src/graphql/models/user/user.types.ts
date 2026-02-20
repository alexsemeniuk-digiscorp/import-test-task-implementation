import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

import {
  ApiBusinessLocationBusinessLocation,
  ApiPayRatePayRate,
  PluginUsersPermissionsRole,
} from '../../../types/generated/contentTypes';

export interface UserRegisterInput {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phoneNumber?: string;
  referralCode?: string;
  tenantSlug?: string;
  role?: PluginUsersPermissionsRole;
  businessLocation?: ApiBusinessLocationBusinessLocation;
  payRate?: ApiPayRatePayRate;
}

export interface CustomerUserRegisterInput {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  tenantSlug?: string;
  websiteId?: string;
}

export interface User extends UsersPermissions.UserEntity {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  tenantId?: number;
}

export interface UserResendConfirmationInput {
  email: string;
  type: 'user' | 'employee';
}

export interface CreateNewRoleInput {
  tenantId: ID;
  role: string;
  description?: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}
