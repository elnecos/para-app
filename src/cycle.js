// Prognoza cyklu z historii okresów (owulacja ≈ 13 dni przed kolejnym okresem).
export const DAY = 864e5;

export const mid = (d) => { const x = new Date(d); x.setHours(12, 0, 0, 0); return x; };
export const iso = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};
export const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); };
export const addDays = (d, k) => { const x = new Date(d); x.setDate(x.getDate() + k); return mid(x); };
export const diffDays = (a, b) => Math.round((mid(a) - mid(b)) / DAY);

export function stats(periods) {
  const gaps = [];
  for (let i = 1; i < periods.length; i++) {
    const g = diffDays(parse(periods[i].s), parse(periods[i - 1].s));
    if (g >= 18 && g <= 45) gaps.push(g);
  }
  const last = gaps.slice(-6);
  const pl = periods.slice(-6);
  return {
    L: last.length ? Math.round(last.reduce((a, b) => a + b, 0) / last.length) : 28,
    P: pl.length ? Math.round(pl.reduce((a, b) => a + Number(b.n), 0) / pl.length) : 5,
    gaps: last,
  };
}

export function phaseOf(d, L, pl) {
  const ov = L - 13;
  if (d <= pl) return 'okres';
  if (d === ov) return 'ov';
  if (d >= ov - 4 && d <= ov + 1) return 'fert';
  if (d < ov - 4) return 'foll';
  return d > L - 5 ? 'pms' : 'lut';
}

export function makeCycle(periods) {
  if (!periods.length) return null;
  const st = stats(periods);
  const starts = periods.map((p) => parse(p.s));

  function info(date) {
    const t = mid(date);
    const { L, P } = st;
    let i = -1;
    for (let k = 0; k < starts.length; k++) if (starts[k] <= t) i = k;
    let start, len, plen;
    if (i === -1) {
      const n = Math.ceil(diffDays(starts[0], t) / L);
      start = addDays(starts[0], -n * L); len = L; plen = P;
    } else if (i < starts.length - 1) {
      start = starts[i]; len = diffDays(starts[i + 1], starts[i]); plen = Number(periods[i].n);
    } else {
      const n = Math.floor(diffDays(t, starts[i]) / L);
      start = addDays(starts[i], n * L); len = L; plen = n === 0 ? Number(periods[i].n) : P;
    }
    const cd = diffDays(t, start) + 1;
    return { cd, len, plen, ph: phaseOf(cd, len, plen) };
  }

  function findAhead(from, test, max = 120) {
    for (let k = 0; k < max; k++) if (test(info(addDays(from, k)))) return k;
    return null;
  }

  return { stats: st, info, findAhead };
}

export const isHot = (x) => x.ph === 'fert' || x.ph === 'ov';
export const dni = (k) => `${k} ${k === 1 ? 'dzień' : 'dni'}`;
