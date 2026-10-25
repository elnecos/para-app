import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS as C, SIGNALS } from '../content';
import { Button, Card, H2, Muted } from '../ui';
import { Header, Screen, SexCard, TodayCard, Verdict } from './Shared';

export default function TodayOna({ cycle, state, now, todayIso, signal, send, goTo, status, refresh }) {
  const [pick, setPick] = useState(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function sendSignal() {
    if (!pick) return;
    setBusy(true); setMsg('');
    try {
      await send({ t: 'signal', v: pick, note: note.trim(), d: todayIso });
      setNote(''); setPick(null); setMsg('Wysłane. On już to widzi.');
    } catch { setMsg('Nie udało się wysłać. Sprawdź internet.'); }
    setBusy(false);
  }

  const startedToday = state.periods.some((p) => p.s === todayIso);
  async function periodToday() {
    setBusy(true);
    try { await send({ t: 'period', s: todayIso, n: cycle ? cycle.stats.P : 5 }); } catch {}
    setBusy(false);
  }

  return (
    <Screen refresh={refresh}>
      <Header now={now} status={status} />

      {!cycle ? (
        <Card>
          <H2>Zacznijmy od Twoich okresów</H2>
          <Muted>Zaznacz w kalendarzu, kiedy zaczynały się Twoje ostatnie okresy. Najlepiej 3–6, wtedy prognoza będzie trafna.</Muted>
          <Button title="Otwórz kalendarz" onPress={() => goTo('kal')} />
        </Card>
      ) : (
        <TodayCard cycle={cycle} now={now} contra={state.contra}>
          <Verdict ph={cycle.info(now).ph} />
        </TodayCard>
      )}

      <Card>
        <H2>Daj mu znać na dziś</H2>
        {signal ? (
          <Muted>
            Dziś wysłałaś: {SIGNALS[signal.v].emoji} {SIGNALS[signal.v].label}
            {signal.note ? ` — „${signal.note}”` : ''}. Możesz to zmienić.
          </Muted>
        ) : (
          <Muted>Twój sygnał jest ważniejszy niż prognoza. On zobaczy go na górze swojego ekranu.</Muted>
        )}
        <View style={{ gap: 8 }}>
          {Object.entries(SIGNALS).map(([k, v]) => (
            <Pressable key={k} onPress={() => setPick(k)} style={[s.sig, pick === k && s.sigOn]}>
              <Text style={s.sigEmoji}>{v.emoji}</Text>
              <Text style={[s.sigText, pick === k && { color: '#fff' }]}>{v.label}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Notatka dla niego (opcjonalnie)"
          placeholderTextColor={C.muted}
          style={s.input}
          maxLength={200}
        />
        <Button title={busy ? 'Wysyłam…' : 'Wyślij'} onPress={sendSignal} disabled={!pick || busy} />
        {msg ? <Muted>{msg}</Muted> : null}
      </Card>

      <SexCard state={state} now={now} todayIso={todayIso} send={send} role="ona" cycle={cycle} />

      {cycle ? (
        <Card>
          <H2>Okres</H2>
          {startedToday ? (
            <Muted>Zapisane: okres zaczął się dziś. Prognoza się przeliczyła.</Muted>
          ) : (
            <>
              <Muted>Kliknij, gdy zacznie się okres. Inne daty poprawisz w kalendarzu.</Muted>
              <Button title="Okres zaczął się dziś" kind="ghost" onPress={periodToday} disabled={busy} />
            </>
          )}
        </Card>
      ) : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  sig: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: C.line },
  sigOn: { backgroundColor: C.accent, borderColor: C.accent },
  sigEmoji: { fontSize: 24 },
  sigText: { fontSize: 17, color: C.fg, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12, fontSize: 16, color: C.fg, backgroundColor: C.bg },
});
