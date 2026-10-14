import EmbeddedPostgres from 'embedded-postgres';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, '.embedded_db');

console.log('====================================================');
console.log('  Embedded Portable PostgreSQL Service (Zero-Docker) ');
console.log('====================================================');
console.log('[1/3] Initializing Embedded PostgreSQL cluster at:', dbDir);

const pg = new EmbeddedPostgres({
  databaseDir: dbDir,
  user: 'admin',
  password: 'password',
  port: 5432,
  persistent: true,
});

try {
  await pg.initialise();
  console.log('  -> Initialization successful.');
} catch (e) {
  console.log('  -> Cluster exists, proceeding to start.');
}

console.log('[2/3] Starting PostgreSQL server on localhost:5432...');
await pg.start();
console.log('  -> PostgreSQL server started!');

console.log('[3/3] Ensuring database "licensing" exists...');
try {
  await pg.createDatabase('licensing');
  console.log('  -> Database "licensing" created.');
} catch (e) {
  console.log('  -> Database "licensing" ready.');
}

console.log('====================================================');
console.log(' PostgreSQL is LIVE on localhost:5432!');
console.log(' Database URL: postgresql://admin:password@localhost:5432/licensing');
console.log(' Keeping database alive (Press Ctrl+C to stop)...');
console.log('====================================================');

// Handle clean shutdown
process.on('SIGINT', async () => {
  console.log('\nStopping PostgreSQL...');
  await pg.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pg.stop();
  process.exit(0);
});

// Keep process running
setInterval(() => {}, 10000);
