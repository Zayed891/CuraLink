import { connectDB } from './config/db.js';
import env from './config/env.js';
import app from './app.js';

async function startServer() {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`\n🧬 Curalink API running on http://localhost:${env.PORT}`);
    console.log(`   LLM Mode   : ${env.LLM_MODE.toUpperCase()}`);
    console.log(`   LLM Model  : ${env.LLM_MODE === 'groq' ? env.GROQ_MODEL : env.OLLAMA_MODEL}`);
    console.log(`   Environment: ${env.NODE_ENV}\n`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal error:', err);
  process.exit(1);
});
