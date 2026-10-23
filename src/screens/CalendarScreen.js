import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS as C, PH } from '../content';
import { Button, Card, DayGrid, H2, Legend, Muted, monthDays } from '../ui';
import { addDays, iso } from '../cycle';
import { Header, Screen } from './Shared';

export default function CalendarScreen({ cfg, cycle, state, now, todayIso, send, status, refresh }) {
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [sel, setSel] = useState(null);
  const [len, setLen] = useState(cycle ? cycle.stats.P : 5);
  const [busy, setBusy] = useState(false);
  const isOna = cfg.role === 'ona';

  const move = (k) => { const d = new Date(ym.y, ym.m + k, 1); setYm({ y: d.getFullYear(), m: d.getMonth() }); setSel(null); };
  const marks = Object.fromEntries(state.periods.map((x) => [x.s, '•']));
  const selIso = sel ? iso(sel) : null;
  const selPeriod = state.periods.find((p) => p.s === selIso);
  const selInfo = sel && cycle ? cycle.info(sel) : null;

  async function act(payload) {
    setBusy(true);
    try { await send(payload); } catch {}
    setBusy(false); setSel(null);
  }

  // Najbliższe owulacje (do pół roku)
  const ovs = [];
  if (cycle) for (let k = 0; k < 183 && ovs.length < 6; k++) { const d = addDays(now, k); if (cycle.info(d).ph === 'ov') ovs.push(d); }

  return (
    <Screen refresh={refresh}>
      <Header now={now} status={status} />
      <Card>
        <View style={s.nav}>
          <Pressable onPress={() => move(-1)} hitSlop={12}><Text style={s.arrow}>‹</Text></Pressable>
          <Text style={s.month}>{new Date(ym.y, ym.m, 1).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}</Text>
          <Pressable onPress={() => move(1)} hitSlop={12}><Text style={s.arrow}>›</Text></Pressable>
        </View>
        <DayGrid days={monthDays(ym.y, ym.m)} cycle={cycle} todayIso={todayIso} marked={marks} onPress={setSel} />
        {cycle ? <Legend /> : <Muted>{isOna ? 'Dotknij dnia, w którym zaczął się okres.' : 'Ona jeszcze nie wpisała okresów.'}</Muted>}
      </Card>

      {sel ? (
        <Card>
          <H2>{sel.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</H2>
          {selInfo ? <Muted>Dzień cyklu {selInfo.cd} · {PH[selInfo.ph].name}</Muted> : null}
          {isOna && selPeriod ? (
            <>
              <Muted>Tego dnia zaczął się okres ({selPeriod.n} dni).</Muted>
              <Button title="Usuń ten okres" kind="ghost" onPress={() => act({ t: 'period_del', s: selIso })} disabled={busy} />
            </>
          ) : null}
          {isOna && !selPeriod ? (
            <>
              <Muted>Okres zaczął się tego dnia? Ile dni trwał?</Muted>
              <View style={s.stepper}>
                <Button title="−" kind="ghost" onPress={() => setLen(Math.max(1, len - 1))} style={s.stepBtn} />
                <Text style={s.stepVal}>{len} dni</Text>
                <Button title="+" kind="ghost" onPress={() => setLen(Math.min(10, len + 1))} style={s.stepBtn} />
              </View>
              <Button title="Zapisz początek okresu" onPress={() => act({ t: 'period', s: selIso, n: len })} disabled={busy} />
            </>
          ) : null}
        </Card>
      ) : null}

      {cycle ? (
        <Card>
          <H2>Najbliższe owulacje</H2>
          {ovs.map((d) => <Text key={iso(d)} style={s.ov}>{d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</Text>)}
          <Muted>Średni cykl: {cycle.stats.L} dni{cycle.stats.gaps.length ? ` (ostatnie: ${cycle.stats.gaps.join(', ')})` : ''}. Im dalej w przyszłość, tym większy margines błędu.</Muted>
        </Card>
      ) : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { fontSize: 32, color: C.accent, paddingHorizontal: 8 },
  month: { fontSize: 18, fontWeight: '600', color: C.fg, textTransform: 'capitalize' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 16, justifyContent: 'center' },
  stepBtn: { width: 52, paddingVertical: 8 },
  stepVal: { fontSize: 20, fontWeight: '600', color: C.fg, minWidth: 80, textAlign: 'center' },
  ov: { color: C.fg, fontSize: 16, fontVariant: ['tabular-nums'] },
});
