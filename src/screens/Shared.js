// Elementy wspólne dla obu ekranów „Dziś”
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS as C, PH } from '../content';
import { Card, Muted, Label } from '../ui';
import { addDays, dni, isHot } from '../cycle';

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

export function TodayCard({ cycle, now, children }) {
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
