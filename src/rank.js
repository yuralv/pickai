function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function reasonFor(product, p, prefs = []) {
  const reasons = [];
  if (Number.isFinite(p.maxPrice) && product.price <= p.maxPrice) reasons.push(`예산 ${p.maxPrice.toLocaleString('ko-KR')}원 이내`);
  if (Number.isFinite(p.minPrice) && product.price >= p.minPrice) reasons.push('최저 예산 조건 충족');
  if (p.color && product.color === p.color) reasons.push(`${p.color === 'black' ? '검정' : p.color === 'white' ? '흰색' : p.color === 'pink' ? '핑크' : p.color} 색상`);
  if (p.wireless !== null && product.wireless === p.wireless) reasons.push(product.wireless ? '무선 조건 일치' : '유선 조건 일치');
  if (p.silent === true && product.silent) reasons.push('저소음 조건 일치');
  if (p.gaming === true && product.gaming) reasons.push('게이밍 조건 일치');
  if (p.rgb === false && product.rgb === false) reasons.push('RGB 비선호 조건 일치');
  if (p.rgb === true && product.rgb === true) reasons.push('RGB 선호 조건 일치');
  if (p.layout && product.layout === p.layout) reasons.push(`${p.layout} 배열`);
  for (const pref of prefs) {
    const v = pref.toLowerCase();
    if (/rgb|led/.test(v) && /싫|별로|없/.test(v) && !product.rgb) reasons.push('저장된 취향 반영');
    if (/무선/.test(v) && product.wireless) reasons.push('저장된 무선 취향 반영');
    if (/저소음|조용/.test(v) && product.silent) reasons.push('저장된 저소음 취향 반영');
  }
  return [...new Set(reasons)].slice(0, 4);
}

export function scoreProduct(product, p, prefs = []) {
  let score = 0;

  if (Number.isFinite(p.maxPrice)) {
    if (product.price <= p.maxPrice) score += 5;
    else score -= clamp(1 + ((product.price - p.maxPrice) / Math.max(10000, p.maxPrice)) * 5, 1, 7);
  }
  if (Number.isFinite(p.minPrice)) score += product.price >= p.minPrice ? 1 : -2;
  if (p.color) score += product.color === p.color ? 4 : 0;
  if (p.wireless !== null) score += product.wireless === p.wireless ? 3 : -1;
  if (p.silent === true) score += product.silent === p.silent ? 4 : -1;
  if (p.gaming === true) score += product.gaming === p.gaming ? 3 : -1;
  if (p.rgb !== null) score += product.rgb === p.rgb ? 2 : -1;
  if (p.layout) score += product.layout === p.layout ? 4 : 0;

  const hay = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  for (const kw of p.keywords || []) if (kw && hay.includes(String(kw).toLowerCase())) score += 0.6;

  for (const pref of prefs) {
    const v = String(pref).toLowerCase();
    if (/rgb|led/.test(v) && /싫|별로|없/.test(v) && product.rgb) score -= 3;
    if (/무선/.test(v) && product.wireless) score += 1;
    if (/저소음|조용/.test(v) && product.silent) score += 1;
    if (/검정|블랙/.test(v) && product.color === 'black') score += 1;
  }

  // Small quality tie-breakers using information we already have.
  if (product.rating > 0) score += Math.min(1.2, product.rating / 5);
  if (product.reviewCount > 0) score += Math.min(0.9, Math.log10(product.reviewCount + 1) / 5);
  if (product.isRocket) score += 0.2;
  return score;
}

export function rankProducts(products, parsed, prefs = []) {
  return products
    .map((x) => {
      const matchScore = Math.round(scoreProduct(x, parsed, prefs) * 10) / 10;
      return {
        ...x,
        matchScore,
        matchPercent: Math.round(clamp(55 + matchScore * 4, 1, 99)),
        reasons: reasonFor(x, parsed, prefs),
      };
    })
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      const ar = Number(a.rating || 0);
      const br = Number(b.rating || 0);
      if (br !== ar) return br - ar;
      return Number(a.price || 0) - Number(b.price || 0);
    })
    .slice(0, 20);
}
