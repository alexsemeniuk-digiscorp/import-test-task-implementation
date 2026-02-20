import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

export type OrderContactData = {
  contact?: {
    id?: ID;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    birthdayDate?: string;
    address?: string;
    points?: number;
  } | null;
  lead?: {
    id?: ID;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  } | null;
  company?: {
    id?: ID;
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    points?: number;
  } | null;
  firstName: string;
};
