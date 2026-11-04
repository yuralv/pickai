const encode = (value) => encodeURIComponent(String(value ?? '').trim());

/**
 * Creates ordinary keyword-search links. These links never claim that a
 * product was found, priced, or checked by PickAI.
 */
export function buildStoreLinks(searchQuery) {
  const q = String(searchQuery ?? '').trim().slice(0, 120);
  const encoded = encode(q);
  return [
    {
      id: 'amazon',
      name: 'Amazon',
      region: '해외',
      url: `https://www.amazon.com/s?k=${encoded}`,
    },
    {
      id: 'elevenst',
      name: '11번가',
      region: '국내',
      url: `https://search.11st.co.kr/pc/total-search?kwd=${encoded}`,
    },
    {
      id: 'coupang',
      name: '쿠팡',
      region: '국내',
      url: `https://www.coupang.com/np/search?q=${encoded}`,
    },
    {
      id: 'aliexpress',
      name: 'AliExpress',
      region: '해외',
      url: `https://www.aliexpress.com/w/wholesale-${encoded}.html`,
    },
    {
      id: 'temu',
      name: 'Temu',
      region: '해외',
      url: `https://www.temu.com/search_result.html?search_key=${encoded}`,
    },
  ];
}
