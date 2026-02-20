import Strapi from '@strapi/strapi';
import * as fs from 'fs';

let instance;

async function setupStrapi() {
  if (!instance) {
    await (Strapi({ distDir: './dist' }) as any).load();

    instance = strapi;
    await instance.server.mount();
  }
  return instance;
}

async function cleanupStrapi() {
  const dbSettings = strapi.config.get('database.connection') as any;
  console.log(dbSettings); // confirm that we are pointing to sqlite
  // with the tmp file residing in /myprojectname/.tmp/test.db'
  //close server to release the db-file
  await strapi.server.httpServer.close();
  await strapi.db.connection.destroy();

  //delete test database after all tests have completed

  if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
    const tmpDbFile = dbSettings.connection.filename;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
}
export { cleanupStrapi, setupStrapi };
