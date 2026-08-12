import { buildApp } from './app';
import { env } from './config/env';

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ 
      port: parseInt(env.PORT), 
      host: '0.0.0.0' 
    });
    
    console.log(`🚀 VideoFlow server running on port ${env.PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
