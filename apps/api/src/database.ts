import { Provider } from '@nestjs/common';
import { createDatabase, type Database } from '@musdist/database';

export const DATABASE = Symbol('DATABASE');

export const databaseProvider: Provider = {
  provide: DATABASE,
  useFactory: (): Database => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is required');
    return createDatabase(url);
  },
};
