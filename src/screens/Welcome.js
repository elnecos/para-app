import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS as C } from '../content';
import { Button, Card, Muted } from '../ui';
import { ensureSession, isConfigured, supabase } from '../supabase';
import { newKey } from '../crypto';
import { savePair } from '../pairStore';

export default function Welcome({ onPaired, onScan }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function createPair() {
    setErr('');
    if (!isConfigured()) { setErr('Aplikacja nie ma jeszcze adresu serwera. Uzupełnij plik src/config.js.'); return; }
    setBusy(true);
    try {
      await ensureSession();
      const { data, error } = await supabase.rpc('create_pair');
      if (error) throw error;
      const cfg = { pairId: data, key: newKey(), role: 'ona' };
      await savePair(cfg);
      onPaired(cfg, { showQr: true });
    } catch (e) {
      setErr('Nie udało się założyć pary: ' + (e.message || e));
    }
    setBusy(false);
  }

  return (
    <View style={s.wrap}>
      <View style={{ gap: 8 }}>
        <Text style={s.title}>Para</Text>
        <Muted>Wspólny kalendarz jej cyklu. Ona daje znać, jak się czuje, a on wie, co dziś zrobić. Wszystko jest szyfrowane i widzicie to tylko Wy dwoje.</Muted>
      </View>
      <Card>
        <Text style={s.h}>Jestem nią</Text>
        <Muted>Zakładam parę i pokazuję mężowi kod do zeskanowania.</Muted>
        <Button title="Załóż parę" onPress={createPair} disabled={busy} />
      </Card>
      <Card>
        <Text style={s.h}>Jestem nim</Text>
        <Muted>Skanuję kod z jej telefonu.</Muted>
        <Button title="Zeskanuj kod" kind="ghost" onPress={onScan} disabled={busy} />
      </Card>
      {busy ? <ActivityIndicator color={C.accent} /> : null}
      {err ? <Text style={s.err}>{err}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 16, justifyContent: 'center' },
  title: { fontSize: 44, fontWeight: '800', color: C.accent, letterSpacing: -1 },
  h: { fontSize: 18, fontWeight: '600', color: C.fg },
  err: { color: C.okres, fontSize: 15 },
});
