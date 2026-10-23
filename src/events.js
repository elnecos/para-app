// Zaszyfrowane wpisy pary: okresy, sygnały. Odczyt, zapis i nasłuch na żywo.
import { supabase } from './supabase';
import { seal, open } from './crypto';

export async function fetchEvents(cfg) {
  const { data, error } = await supabase
    .from('events')
    .select('id, author, nonce, box, created_at')
    .eq('pair_id', cfg.pairId)
    .order('id', { ascending: true });
  if (error) throw error;
  return data
    .map((r) => ({ id: r.id, author: r.author, at: r.created_at, ...(open(r.nonce, r.box, cfg.key) || { t: 'unreadable' }) }))
    .filter((e) => e.t !== 'unreadable');
}

export async function addEvent(cfg, payload) {
  const { nonce, box } = seal(payload, cfg.key);
  const { error } = await supabase.from('events').insert({ pair_id: cfg.pairId, nonce, box });
  if (error) throw error;
}

export function subscribe(cfg, onChange) {
  const ch = supabase
    .channel('pair-' + cfg.pairId)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events', filter: `pair_id=eq.${cfg.pairId}` }, onChange)
    .subscribe();
  return () => supabase.removeChannel(ch);
}

// Stan pary z listy wpisów (ostatni wpis wygrywa)
export function reduce(events) {
  const periods = new Map();
  let signals = [];
  for (const e of events) {
    if (e.t === 'period') periods.set(e.s, { s: e.s, n: e.n });
    else if (e.t === 'period_del') periods.delete(e.s);
    else if (e.t === 'signal') signals.push(e);
  }
  return { periods: [...periods.values()].sort((a, b) => (a.s < b.s ? -1 : 1)), signals };
}
