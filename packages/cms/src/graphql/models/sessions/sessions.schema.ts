import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'Sessions'>({
    type: 'Sessions',
    definition: (t) => {
      t.nullable.string('ip');
      t.nullable.string('browser');
      t.nullable.string('device');
    },
  }),
];

export const sessionsSchema = [...typeSchema];
