import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recommendShopping } from './src/parser.js';
import { buildStoreLinks } from './src/stores.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const startedAt = Date.now();
const VERSION = '6.1.0';

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public'), { etag: true, maxAge: '1h' }));

const hasText = (value) => String(value ?? '').trim().length > 0;

function meta() {
  const aiConfigured = Boolean(
    process.env.OPENAI_API_KEY?.trim() && process.env.OPENAI_MODEL?.trim(),
  );
  return {
    app: 'PickAI',
    version: VERSION,
    uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    aiConfigured,
    modelConfigured: Boolean(process.env.OPENAI_MODEL?.trim()),
    mode: aiConfigured ? 'ai' : 'rule-based',
    stores: ['Amazon', '11번가', '쿠팡', 'AliExpress', 'Temu'],
  };
}

app.get('/api/health', (_req, res) => res.json({ ok: true, ...meta() }));

app.get('/api/meta', (_req, res) => res.json({
  ok: true,
  ...meta(),
  capabilities: [
    'Korean shopping intent analysis',
    'saved preference-aware search suggestions',
    'Amazon, 11st, Coupang, AliExpress and Temu keyword search links',
    'browser-local search history and preferences',
  ],
}));

async function handleRecommend(req, res) {
  const requestId = crypto.randomUUID();
  const started = Date.now();

  try {
    const text = String(req.body?.query ?? '').trim();
    const prefs = Array.isArray(req.body?.prefs)
      ? req.body.prefs.map((value) => String(value).trim()).filter(hasText).slice(0, 15)
      : [];

    if (!text) return res.status(400).json({ requestId, error: '검색할 내용을 입력해 줘.' });
    if (text.length > 500) return res.status(400).json({ requestId, error: '검색 내용은 500자 이내로 입력해 줘.' });

    const result = await recommendShopping({ text, prefs });
    const recommendations = result.recommendations.map((item, index) => ({
      id: `rec-${index + 1}`,
      ...item,
      stores: buildStoreLinks(item.searchQuery),
    }));

    res.json({
      requestId,
      query: text,
      summary: result.summary,
      parsed: result.parsed,
      recommendations,
      parser: result.parser,
      aiConfigured: result.aiConfigured,
      warning: result.warning || null,
      durationMs: Date.now() - started,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[${requestId}] recommendation error:`, error?.message || error);
    res.status(500).json({ requestId, error: '추천을 만드는 중 문제가 생겼어. 잠시 후 다시 시도해 줘.' });
  }
}

app.post('/api/recommend', handleRecommend);
app.post('/api/search', handleRecommend);

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: '존재하지 않는 API 경로야.' });
  }
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err?.message || err);
  if (res.headersSent) return;
  res.status(err?.status === 400 ? 400 : 500).json({ error: '요청을 처리하지 못했어.' });
});

app.listen(port, () => {
  console.log(`PickAI v${VERSION} running on port ${port}`);
  console.log(`Recommendation mode: ${meta().mode}`);
  if (!meta().aiConfigured) {
    console.log('OPENAI_API_KEY or OPENAI_MODEL is missing. Rule-based recommendations are enabled.');
  }
});
