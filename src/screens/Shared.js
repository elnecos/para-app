// Elementy wspólne dla obu ekranów „Dziś”
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS as C, CONTRA, CONTRA_LEVEL, PH } from '../content';
import { Button, Card, H2, Muted, Label } from '../ui';
import { addDays, diffDays, dni, isHot, iso, parse } from '../cycle';

export function Screen({ children, refresh }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, gap: 16 }}
      refreshControl={refresh ? <RefreshControl refreshing={false} onRefresh={refresh} /> : undefined}
    >
      {children}
    </ScrollView>
  );
}

export const fmtDay = (d) => `${d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}`;

export function Header({ now, status }) {
  return (
    <View style={s.header}>
      <Text style={s.title}>Para</Text>
      <Text style={s.date}>{now.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
      {status === 'error' ? <Text style={s.offline}>Brak połączenia — pokazuję ostatnie dane</Text> : null}
    </View>
  );
}

export function cycleNumbers(cycle, now) {
  const today = cycle.info(now);
  const toOv = cycle.findAhead(now, (x) => x.ph === 'ov');
  const toP = cycle.findAhead(addDays(now, 1), (x) => x.cd === 1) + 1;
  let spicy;
  if (isHot(today)) {
    const left = cycle.findAhead(now, (x) => !isHot(x));
    spicy = `Najlepszy czas na romans trwa jeszcze ${dni(left)}.`;
  } else {
    const k = cycle.findAhead(now, isHot);
    spicy = `Dni płodne za ${dni(k)}: od ${fmtDay(addDays(now, k))}.`;
  }
  return { today, toOv, toP, spicy };
}

export function TodayCard({ cycle, now, children, contra }) {
  const { today, toOv, toP, spicy } = cycleNumbers(cycle, now);
  const p = PH[today.ph], col = C[today.ph];
  return (
    <Card style={{ borderTopWidth: 6, borderTopColor: col }}>
      <Label>Dzień cyklu</Label>
      <View style={s.dayRow}>
        <Text style={[s.dayNum, { color: col }]}>{today.cd}</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.phase}>{p.name}</Text>
          <Muted>{p.sub}</Muted>
        </View>
      </View>
      {children}
      <Muted>
        {toOv === 0 ? 'Owulacja: dziś. ' : `Owulacja za ${dni(toOv)}. `}Następny okres za {dni(toP)}.
      </Muted>
      <View style={[s.spicy, { borderColor: C.ov + '70' }]}><Text style={s.spicyText}>{spicy}</Text></View>
      <ContraBanner contra={contra} hot={isHot(today)} />
    </Card>
  );
}

export function Verdict({ ph }) {
  const p = PH[ph], col = C[ph];
  return (
    <View style={[s.verdict, { backgroundColor: col + '22' }]}>
      <View style={[s.pill, { backgroundColor: col }]}><Text style={s.pillText}>{p.pill}</Text></View>
      <Text style={s.body}>{p.adv}</Text>
    </View>
  );
}

export const textStyles = StyleSheet.create({
  body: { color: C.fg, fontSize: 16, lineHeight: 22 },
  contra: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 },
  contraTitle: { fontWeight: '700', fontSize: 15 },
  contraText: { color: C.fg, fontSize: 15, lineHeight: 21 },
  contraNote: { color: C.muted, fontSize: 13, lineHeight: 18 },
});

const s = StyleSheet.create({
  header: { gap: 2 },
  title: { fontSize: 24, fontWeight: '800', color: C.fg },
  date: { color: C.muted, fontSize: 15 },
  offline: { color: C.okres, fontSize: 13, marginTop: 4 },
  dayRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  dayNum: { fontSize: 72, fontWeight: '800', lineHeight: 74, fontVariant: ['tabular-nums'] },
  phase: { fontSize: 24, fontWeight: '600', color: C.fg },
  spicy: { borderWidth: 1, borderRadius: 12, padding: 12 },
  spicyText: { color: C.fg, fontSize: 15 },
  verdict: { borderRadius: 14, padding: 14, gap: 8 },
  pill: { alignSelf: 'flex-start', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  body: { color: C.fg, fontSize: 16, lineHeight: 22 },
});

// Karta „Kiedy był stosunek” — wspólna dla obu ekranów
export function SexCard({ state, now, todayIso, send, role, cycle }) {
  const [busy, setBusy] = useState(false);
  const yIso = iso(addDays(now, -1));
  const past = state.sex.filter((d) => d <= todayIso);
  const add = async (d) => { setBusy(true); try { await send({ t: 'sex', d }); } catch {} setBusy(false); };

  let line = 'Brak wpisów. Zaznacz, gdy coś się wydarzy.', tip = null;
  if (past.length) {
    const last = past[past.length - 1], ago = diffDays(now, parse(last));
    const week = past.filter((d) => diffDays(now, parse(d)) < 7).length;
    const when = ago === 0 ? 'dziś' : ago === 1 ? 'wczoraj' : `${ago} dni temu (${fmtDay(parse(last))})`;
    line = `Ostatnio: ${when} · w ostatnich 7 dniach: ${week} ${week === 1 ? 'raz' : 'razy'}`;
    if (role === 'on') {
      const hot = cycle && isHot(cycle.info(now));
      if (ago === 0) tip = 'Dziś już było. Przytulajcie się i odpoczywajcie.';
      else if (ago === 1) tip = hot ? 'Wczoraj było, ale to dni płodne, więc dziś też możesz spróbować. Delikatnie i bez nacisku.' : 'Wczoraj było. Dziś bez marudzenia: przytul ją i daj odpocząć.';
      else if (ago <= 3) tip = 'Jest dobrze. Jeśli macie ochotę, zacznij od czułości.';
      else tip = cycle && cycle.info(now).ph === 'okres' ? 'Trwa okres, więc cierpliwości. Czułość zamiast nacisku.' : 'Minęło kilka dni. Dobry moment, żeby zacząć od masażu albo pocałunków.';
    }
  }
  const doneToday = state.sex.includes(todayIso), doneY = state.sex.includes(yIso);

  return (
    <Card>
      <H2>Kiedy był stosunek</H2>
      <Text style={s.body}>{line}</Text>
      {tip ? <Muted>{tip}</Muted> : null}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title={doneToday ? 'Dziś ♥' : 'Był dziś'} onPress={() => add(todayIso)} disabled={busy || doneToday} style={{ flex: 1 }} />
        <Button title={doneY ? 'Wczoraj ♥' : 'Był wczoraj'} kind="ghost" onPress={() => add(yIso)} disabled={busy || doneY} style={{ flex: 1 }} />
      </View>
      <Muted style={{ fontSize: 13 }}>Inne dni zaznaczysz i usuniesz w kalendarzu. Widzicie to oboje.</Muted>
    </Card>
  );
}

// Informacja o antykoncepcji: zawsze w dni płodne, a przy codziennych tabletkach codziennie
export function ContraBanner({ contra, hot }) {
  if (!contra) return null;
  const m = CONTRA[contra];
  if (!m || (!hot && !m.daily)) return null;
  const lv = CONTRA_LEVEL[m.level];
  return (
    <View style={[s.contra, { backgroundColor: lv.color + '1f', borderColor: lv.color }]}>
      <Text style={[s.contraTitle, { color: lv.color }]}>{lv.title} · {m.label}</Text>
      <Text style={s.contraText}>{m.tip}</Text>
      {m.suppresses ? <Text style={s.contraNote}>Przy tej metodzie owulacja zwykle nie zachodzi, więc fazy w aplikacji to orientacyjny rytm nastroju, a nie płodności.</Text> : null}
    </View>
  );
}
