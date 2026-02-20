import { MINUTE } from './time';

export const COOL_DOWN_PERIOD_IN_MINUTES = 5;
export const COOL_DOWN_PERIOD_IN_MILLISECONDS =
  COOL_DOWN_PERIOD_IN_MINUTES * MINUTE;
//subscription free trail in days

export const FREE_TRAIL_DAYS = 180;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export const FRONTEND_URL = process.env.FRONTEND_URL;

export const MINIMUM_AFTERPAY_CLEARPAY_AMOUNT = 1;
export const MAXIMUM_AFTERPAY_CLEARPAY_AMOUNT = 4000;

export const MINIMUM_AFFIRM_AMOUNT = 50;
export const MAXIMUM_AFFIRM_AMOUNT = 30000;

export const MAXIMUM_STRIPE_PAYMENT_AMOUNT = 999999.99;

export const DEFAULT_APPLICATION_FEE = 1;

//QuickBooks constants
export const QB_SCOPE =
  'com.intuit.quickbooks.accounting openid email phone profile';
export const QB_STATE = 'testState';
export const QUICK_BOOKS_BATCH_SIZE = 25;
export const QUICK_BOOKS_BATCH_SIZE_CONTACTS = 15;
export const QUICK_BOOKS_BATCH_COOL_TIME = 1500;
export const ENTITY_PAGE_SIZE = 500;

export const PDF_GENERATOR_WORKSPACE_ID =
  process.env.PDF_GENERATOR_WORKSPACE_ID;
export const PDF_GENERATOR_BASE_URL = process.env.PDF_GENERATOR_BASE_URL;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
