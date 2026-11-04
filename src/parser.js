const CATEGORY_RULES = [
  [/키보드|keyboard/i, '키보드'],
  [/마우스|mouse/i, '마우스'],
  [/헤드셋|headset/i, '헤드셋'],
  [/노트북|laptop/i, '노트북'],
  [/모니터|monitor/i, '모니터'],
  [/이어폰|earbuds|에어팟/i, '이어폰'],
  [/스피커|speaker/i, '스피커'],
  [/태블릿|tablet|아이패드/i, '태블릿'],
  [/휴대폰|스마트폰|핸드폰|폰케이스|휴대전화/i, '스마트폰 액세서리'],
  [/의자|체어|chair/i, '의자'],
  [/책상|desk/i, '책상'],
  [/가방|백팩|backpack/i, '가방'],
  [/운동화|러닝화|신발|sneaker/i, '신발'],
  [/패딩|코트|자켓|재킷|점퍼/i, '아우터'],
  [/선풍기|서큘레이터|fan/i, '선풍기'],
  [/청소기|vacuum/i, '청소기'],
  [/키보드|mouse/i, '주변기기'],
];

const STOP_WORDS = new Set([
  '찾아줘','찾아','추천','추천해줘','추천해','사고싶어','사고','싶어','이하','이상','보다',
  '좋은','좋고','그리고','좀','해줘','해주세요','으로','로','을','를','이','가','의','에',
  '한','원','만원','가격','제품','상품','구매','싶다','부탁해','부탁드립니다','알려줘',
]);

function unique(values) {
  return [...new Set(values.map((v) => String(v || '').trim()).filter(Boolean))];
}

export function heuristicParse(text = '') {
  const original = String(text).trim();
  const s = original.toLowerCase().replaceAll(',', ' ');
  const parsed = {
    category: '상품', query: original, maxPrice: null, minPrice: null,
    color: null, wireless: null, silent: null, gaming: null, rgb: null,
    layout: null, keywords: [],
  };

  const maxMan = s.match(/(?:\b|\D)(\d+(?:\.\d+)?)\s*(?:만원|만 원)\s*(?:이하|밑|미만|안쪽)?/);
  if (maxMan && /이하|밑|미만|안쪽/.test(s)) parsed.maxPrice = Math.round(Number(maxMan[1]) * 10000);
  else if (maxMan && !/이상|부터|초과/.test(s)) parsed.maxPrice = Math.round(Number(maxMan[1]) * 10000);
  const won = s.match(/(?:\b|\D)(\d{2,8})\s*원\s*(?:이하|밑|미만|안쪽)?/);
  if (parsed.maxPrice == null && won && !/이상|부터|초과/.test(s)) parsed.maxPrice = Number(won[1]);
  const minMan = s.match(/(?:최소|이상|부터)\s*(\d+(?:\.\d+)?)\s*(?:만원|만 원)/);
  if (minMan) parsed.minPrice = Math.round(Number(minMan[1]) * 10000);
  const minWon = s.match(/(?:최소|이상|부터)\s*(\d{2,8})\s*원/);
  if (minWon) parsed.minPrice = Number(minWon[1]);

  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(s)) { parsed.category = category; break; }
  }

  if (/검정|블랙|검은색|black/.test(s)) parsed.color = 'black';
  else if (/화이트|흰색|하얀색|white/.test(s)) parsed.color = 'white';
  else if (/핑크|분홍/.test(s)) parsed.color = 'pink';
  else if (/파랑|블루|blue/.test(s)) parsed.color = 'blue';

  if (/무선|블루투스|wireless|2\.4g/.test(s)) parsed.wireless = true;
  if (/유선만|유선으로|유선 제품|유선 키보드/.test(s)) parsed.wireless = false;
  if (/조용|저소음|사무용|silent/.test(s)) parsed.silent = true;
  if (/게이밍|게임용|gaming/.test(s)) parsed.gaming = true;
  if (/rgb.*없|rgb.*싫|rgb.*별로|led.*없|led.*싫/.test(s)) parsed.rgb = false;
  else if (/rgb|led|화려/.test(s)) parsed.rgb = true;

  if (/텐키리스|tkl/.test(s)) parsed.layout = '텐키리스';
  else if (/75\s*%|75퍼/.test(s)) parsed.layout = '75%';
  else if (/65\s*%|65퍼/.test(s)) parsed.layout = '65%';
  else if (/60\s*%|60퍼/.test(s)) parsed.layout = '60%';
  else if (/풀배열|104키/.test(s)) parsed.layout = '풀배열';

  parsed.keywords = unique(s.split(/\s+/)
    .map((x) => x.replace(/[^\p{L}\p{N}%.-]/gu, ''))
    .filter((x) => x.length > 1 && !STOP_WORDS.has(x) && !/^\d+(?:\.\d+)?$/.test(x)))
    .slice(0, 10);
  return parsed;
}

function normalizeString(value, fallback, maxLength = 160) {
  return typeof value === 'string' && value.trim()
    ? value.trim().slice(0, maxLength)
    : fallback;
}

function cleanRecommendations(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 3).map((item) => ({
    title: normalizeString(item?.title, '맞춤 검색', 40),
    searchQuery: normalizeString(item?.searchQuery, '', 120),
    reason: normalizeString(item?.reason, '입력하신 조건을 바탕으로 구성한 검색어입니다.', 180),
    check: normalizeString(item?.check, '실제 옵션과 상세 정보를 확인해 주세요.', 140),
  })).filter((item) => item.searchQuery.length > 1);
}

function formatBudget(value) {
  if (!Number.isFinite(value) || value <= 0) return '';
  if (value % 10000 === 0) return `${value / 10000}만원 이하`;
  return `${value.toLocaleString('ko-KR')}원 이하`;
}

function preferenceTerms(prefs = []) {
  const terms = [];
  for (const pref of prefs) {
    const p = String(pref).toLowerCase();
    if (/rgb|led/.test(p) && /싫|별로|없/.test(p)) terms.push('RGB 없는');
    else if (/저소음|조용/.test(p)) terms.push('저소음');
    else if (/무선/.test(p)) terms.push('무선');
    else if (/유선/.test(p)) terms.push('유선');
    else if (/가벼운|가볍/.test(p)) terms.push('가벼운');
    else if (/휴대|휴대성/.test(p)) terms.push('휴대용');
    else if (/심플|미니멀/.test(p)) terms.push('심플 디자인');
    else terms.push(String(pref).trim().slice(0, 28));
  }
  return unique(terms).slice(0, 4);
}

export function fallbackRecommendations(text, prefs, parsed) {
  const category = parsed.category && parsed.category !== '상품' ? parsed.category : '';
  const extras = preferenceTerms(prefs);
  const specs = [];
  if (parsed.color) specs.push(({ black: '블랙', white: '화이트', pink: '핑크', blue: '블루' })[parsed.color] || parsed.color);
  if (parsed.wireless === true) specs.push('무선');
  if (parsed.wireless === false) specs.push('유선');
  if (parsed.silent === true) specs.push('저소음');
  if (parsed.gaming === true) specs.push('게이밍');
  if (parsed.rgb === false) specs.push('RGB 없는');
  if (parsed.layout) specs.push(parsed.layout);
  const budget = formatBudget(parsed.maxPrice);
  const redundantKeywordPatterns = [
    /키보드|keyboard/i,
    /마우스|mouse/i,
    /화이트|흰색|하얀색|white/i,
    /블랙|검정|검은색|black/i,
    /핑크|분홍/i,
    /블루|파랑|blue/i,
    /무선|블루투스|wireless|2\.4g/i,
    /유선/i,
    /저소음|조용|사무용|silent/i,
    /게이밍|게임용|gaming/i,
    /rgb|led|조명/i,
    /텐키리스|tkl|풀배열|104키|75%|65%|60%/i,
    /^\d+(?:\.\d+)?만원?$/,
    /^\d{2,8}원$/,
    /^(이하|미만|이상|안쪽)$/,
  ];
  const userKeywords = (parsed.keywords || [])
    .filter((word) => ![category, '추천', '상품'].includes(word))
    .filter((word) => !redundantKeywordPatterns.some((pattern) => pattern.test(word)))
    .slice(0, 3);
  const base = unique([category, ...specs, ...extras, ...userKeywords, budget]);
  const broadBase = unique([category, ...specs.slice(0, 2), ...extras.slice(0, 2), budget]);
  const titleBase = category || (String(text).trim().split(/\s+/).slice(0, 2).join(' ') || '원하는 상품');
  const build = (...parts) => unique(parts).join(' ').slice(0, 100).trim();

  return [
    {
      title: '요청 조건 그대로',
      searchQuery: build(...base),
      reason: '입력하신 상품 종류와 색상·기능·예산을 가능한 한 그대로 반영한 검색입니다.',
      check: '검색 결과에서 세부 옵션과 최종 결제 가격을 확인해 주세요.',
    },
    {
      title: '가성비 중심으로',
      searchQuery: build(category, ...specs.slice(0, 2), ...extras.slice(0, 1), budget, '가성비'),
      reason: '핵심 조건은 유지하면서 가격 대비 성능이 좋은 선택지를 찾기 위한 검색입니다.',
      check: '최저가뿐 아니라 배송비·보증·후기 내용도 함께 비교해 주세요.',
    },
    {
      title: '대안까지 넓게 보기',
      searchQuery: build(...broadBase, titleBase === '원하는 상품' ? '' : '추천'),
      reason: '검색 범위를 조금 넓혀 놓치기 쉬운 대체 상품까지 살펴보기 위한 검색입니다.',
      check: '처음 중요하게 생각하신 조건이 빠지지 않았는지 확인해 주세요.',
    },
  ].map((item) => ({ ...item, searchQuery: item.searchQuery || String(text).trim().slice(0, 100) }));
}

function mergeParsed(fallback, ai) {
  const merged = { ...fallback };
  if (typeof ai?.category === 'string' && ai.category.trim()) merged.category = ai.category.trim().slice(0, 40);
  for (const key of ['maxPrice', 'minPrice']) {
    if (fallback[key] == null && Number.isFinite(Number(ai?.[key])) && Number(ai[key]) > 0) merged[key] = Math.round(Number(ai[key]));
  }
  for (const key of ['color', 'wireless', 'silent', 'gaming', 'rgb', 'layout']) {
    if (fallback[key] == null && (typeof ai?.[key] === 'boolean' || (typeof ai?.[key] === 'string' && ai[key].trim()))) merged[key] = ai[key];
  }
  if ((!fallback.keywords || !fallback.keywords.length) && Array.isArray(ai?.keywords)) {
    merged.keywords = unique(ai.keywords).slice(0, 10);
  }
  return merged;
}

export async function recommendShopping({ text, prefs = [] }) {
  const fallback = heuristicParse(text);
  const fallbackItems = fallbackRecommendations(text, prefs, fallback);
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim();

  if (!apiKey || !model) {
    return {
      parsed: fallback,
      summary: `${fallback.category === '상품' ? '요청한 상품' : fallback.category}에 대해 입력하신 조건과 저장된 취향을 정리했습니다.`,
      recommendations: fallbackItems,
      parser: 'rule-based',
      aiConfigured: false,
    };
  }

  try {
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model,
      input: [
        {
          role: 'system',
          content: `당신은 한국어 쇼핑 취향 분석 도우미 PickAI입니다. 사용자의 요청과 저장된 취향을 분석해 쇼핑몰에서 직접 검색할 검색어 3개를 만들어. 실제 상품명, 가격, 재고, 평점, 판매량을 지어내지 마. 특정 상품을 실제로 찾았다고 말하지 마. 검색어는 입력한 상품 카테고리와 핵심 조건을 반영해야 해. 1번은 요청 조건을 최대한 그대로, 2번은 가성비 관점, 3번은 조건을 약간 넓힌 대안 검색어로 만들어. 반드시 JSON 객체만 출력해 주세요. 필드는 category, maxPrice, minPrice, color, wireless, silent, gaming, rgb, layout, keywords, summary, recommendations야. recommendations는 title, searchQuery, reason, check를 가진 객체 3개 배열이야. 가격은 원 단위 정수 또는 null, 불리언 조건은 true/false/null로 표현해. 모르는 조건은 추측하지 마세요. 검색어는 한국 쇼핑몰에서 자연스럽게 쓰는 짧은 한국어로 작성해. summary, reason, check를 포함한 모든 사용자에게 보이는 문장은 반드시 자연스러운 존댓말로 작성하고 반말·명령조는 사용하지 마. 저장된 취향: ${prefs.join(' | ') || '없음'}.`,
        },
        { role: 'user', content: text },
      ],
    });

    const raw = response.output_text?.trim() || '';
    const jsonText = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const ai = JSON.parse(jsonText);
    const parsed = mergeParsed(fallback, ai);
    const recommendations = cleanRecommendations(ai.recommendations);
    if (recommendations.length !== 3) throw new Error('AI recommendation format was incomplete');

    return {
      parsed,
      summary: normalizeString(ai.summary, `${parsed.category} 조건을 분석했습니다.`, 240),
      recommendations,
      parser: 'openai',
      aiConfigured: true,
    };
  } catch (error) {
    return {
      parsed: fallback,
      summary: 'AI 응답을 완성하지 못해 기본 분석으로 검색어를 생성했습니다.',
      recommendations: fallbackItems,
      parser: 'rule-based-fallback',
      aiConfigured: true,
      warning: 'AI 분석에 실패해 기본 규칙으로 대체했습니다. API 키와 모델 설정을 확인해 주세요.',
    };
  }
}
