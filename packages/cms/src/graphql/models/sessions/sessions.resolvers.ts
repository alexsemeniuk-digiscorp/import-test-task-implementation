import { browser } from './resolvers/browser';
import { device } from './resolvers/device';
import { ip } from './resolvers/ip';

export const sessionsResolvers = {
  device,
  browser,
  ip,
};
