import { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { COLORS as C, PH, SIGNALS } from '../content';
import { Button, Card, DayGrid, H2, Label, Legend, Muted, weeksFrom } from '../ui';
import { Header, Screen, TodayCard, Verdict } from './Shared';

export default function TodayOn({ cycle, now, todayIso, signal, state, status, refresh }) {
  const [shift, setShift] = useState(0);

  const sig = signal ? (
    <Card style={{ backgroundColor: C.accent, borderColor: C.accent }}>
      <Text style={s.sigLabel}>Ona daje znać</Text>
      <Text style={s.sigBig}>{SIGNALS[signal.v].emoji} {SIGNALS[signal.v].label}</Text>
      {signal.note ? <Text style={s.sigNote}>„{signal.note}”</Text> : null}
      <Text style={s.sigTip}>{SIGNALS[signal.v].forHim}</Text>
    </Card>
  ) : null;

  if (!cycle)
    return (
      <Screen refresh={refresh}>
        <Header now={now} status={status} />
        {sig}
        <Card>
          <H2>Czekamy na jej dane</H2>
          <Muted>Gdy ona zaznaczy w kalendarzu swoje ostatnie okresy, zobaczysz tu prognozę i wskazówki na każdy dzień.</Muted>
        </Card>
      </Screen>
    );

  const ph = cycle.info(now).ph, p = PH[ph];
  const msgs = p.msgs, idx = (Math.floor(now / 864e5) + shift) % msgs.length;
  const marks = Object.fromEntries(state.periods.map((x) => [x.s, '•']));

  return (
    <Screen refresh={refresh}>
      <Header now={now} status={status} />
      {sig}
      <TodayCard cycle={cycle} now={now}>
        <Verdict ph={ph} />
      </TodayCard>

      <Card>
        <H2>Instrukcja na dziś</H2>
        <Muted>{p.why}</Muted>
        <View style={{ gap: 6 }}>
          <Label>Rób</Label>
          {p.dos.map((x) => <Text key={x} style={s.li}>•  {x}</Text>)}
        </View>
        <View style={{ gap: 6 }}>
          <Label>Unikaj</Label>
          {p.donts.map((x) => <Text key={x} style={s.li}>•  {x}</Text>)}
        </View>
      </Card>

      <Card>
        <H2>Wiadomość na dziś</H2>
        <View style={[s.msg, { backgroundColor: C[ph] + '1c' }]}><Text style={s.msgText}>{msgs[idx]}</Text></View>
        <View style={s.row}>
          <Muted style={{ flex: 1 }}>{idx + 1} z {msgs.length}</Muted>
          <Button title="Inna" kind="ghost" onPress={() => setShift(shift + 1)} style={{ paddingVertical: 9 }} />
          <Button title="Wyślij" onPress={() => Share.share({ message: msgs[idx] })} style={{ paddingVertical: 9 }} />
        </View>
      </Card>

      <Card>
        <H2>Najbliższe 4 tygodnie</H2>
        <DayGrid days={weeksFrom(now)} cycle={cycle} todayIso={todayIso} marked={marks} />
        <Legend />
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  sigLabel: { color: '#ffffffcc', fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
  sigBig: { color: '#fff', fontSize: 26, fontWeight: '700' },
  sigNote: { color: '#fff', fontSize: 17, fontStyle: 'italic' },
  sigTip: { color: '#ffffffdd', fontSize: 15 },
  li: { color: C.fg, fontSize: 16, lineHeight: 22 },
  msg: { borderRadius: 14, padding: 16 },
  msgText: { color: C.fg, fontSize: 19, lineHeight: 25, fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
