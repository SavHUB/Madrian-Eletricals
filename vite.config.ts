import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

// Dev-server middleware that handles the chat endpoint inside the Vite process.
// This keeps the AI Gateway key on the server (never shipped to the browser)
// and works in environments where only the Vite dev server is running.
function chatApiPlugin(env: Record<string, string>): Plugin {
  // Expose the gateway key to the AI SDK running in the Vite process.
  if (env.AI_GATEWAY_API_KEY) {
    process.env.AI_GATEWAY_API_KEY = env.AI_GATEWAY_API_KEY;
  }

  return {
    name: 'chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({reply: 'Method not allowed'}));
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const {messages} = JSON.parse(Buffer.concat(chunks).toString() || '{}');

          // Imported lazily so a handler error never crashes config loading.
          const {generateChatReply, FALLBACK_REPLY} = await import(
            './server/chat-handler'
          );

          const reply = await generateChatReply(
            Array.isArray(messages) ? messages : []
          );
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({reply: reply || FALLBACK_REPLY}));
        } catch (err) {
          console.log('[v0] /api/chat error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              reply:
                'Something went wrong — please call us on 07956 234 891.',
            })
          );
        }
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), chatApiPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
