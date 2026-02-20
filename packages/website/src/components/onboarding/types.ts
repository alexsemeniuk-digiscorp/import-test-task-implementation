import { UploadFile } from 'antd';

export type LogoFormType = {
  logo?: UploadFile | File | null;
};
export type EmailFormTypes = {
  email: string;
  phoneNumber: string;
  websiteUrl?: string;
};
export type TenantValues = Omit<TenantInput, 'mainLocation' | 'logo'> &
  EmailFormTypes & {
    logo?: UploadFile | null;
    mainLocation: string;
    address?: string | null;
    zipcode?: string | null;
    isOnboardingCompleted?: boolean | null;
  };
export type OnboardingStoreFormType = BusinessLocationInput & LocationInput;
export type EmployeeFormType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  role: string;
};
