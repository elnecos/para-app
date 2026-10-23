import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS as C } from '../content';
import { Button, Muted } from '../ui';
import { ensureSession, isConfigured, supabase } from '../supabase';
import { parseQr, savePair } from '../pairStore';

export default function ScanPair({ onPaired, onBack }) {
  const [perm, requestPerm] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const lock = useRef(false);

  async function onScan({ data }) {
    if (lock.current) return;
    const p = parseQr(data);
    if (!p) { setErr('To nie jest kod z aplikacji Para.'); return; }
    lock.current = true;
    setBusy(true); setErr('');
    try {
      if (!isConfigured()) throw new Error('brak adresu serwera w src/config.js');
      await ensureSession();
      const { error } = await supabase.rpc('join_pair', { p: p.pairId });
      if (error) throw error;
      const cfg = { ...p, role: 'on' };
      await savePair(cfg);
      onPaired(cfg);
    } catch (e) {
      setErr('Nie udało się połączyć: ' + (e.message || e));
      lock.current = false;
    }
    setBusy(false);
  }

  if (!perm) return <View style={s.wrap}><ActivityIndicator color={C.accent} /></View>;
  if (!perm.granted)
    return (
      <View style={[s.wrap, { justifyContent: 'center' }]}>
        <Muted>Aparat jest potrzebny tylko do zeskanowania kodu z jej telefonu.</Muted>
        <Button title="Pozwól na aparat" onPress={requestPerm} />
        <Button title="Wróć" kind="ghost" onPress={onBack} />
      </View>
    );

  return (
    <View style={s.wrap}>
      <Text style={s.h}>Zeskanuj kod z jej telefonu</Text>
      <Muted>Ona znajdzie go w aplikacji: Ustawienia → Pokaż kod parowania.</Muted>
      <View style={s.camBox}>
        <CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={busy ? undefined : onScan} />
      </View>
      {busy ? <ActivityIndicator color={C.accent} /> : null}
      {err ? <Text style={s.err}>{err}</Text> : null}
      <Button title="Wróć" kind="ghost" onPress={onBack} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 14 },
  h: { fontSize: 22, fontWeight: '700', color: C.fg },
  camBox: { flex: 1, maxHeight: 420, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000' },
  err: { color: C.okres, fontSize: 15 },
});
