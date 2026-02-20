import { cleanupStrapi, setupStrapi } from './helpers/strapi';

beforeAll(async () => {
  await setupStrapi();
}, 30000);

afterAll(async () => {
  await cleanupStrapi();
});

it('strapi is defined', () => {
  expect(strapi).toBeDefined();
});

import './user';
