import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS as C } from '../content';
import { Button, Card, H2, Muted } from '../ui';
import { clearPair, qrPayload } from '../pairStore';
import { Header, Screen } from './Shared';

export default function Settings({ cfg, cycle, now, status, onUnpair, openQr }) {
  const [showQr, setShowQr] = useState(openQr);
  const [sure, setSure] = useState(false);

  async function unpair() {
    if (!sure) { setSure(true); setTimeout(() => setSure(false), 4000); return; }
    await clearPair();
    onUnpair();
  }

  return (
    <Screen>
      <Header now={now} status={status} />
      <Card>
        <H2>{cfg.role === 'ona' ? 'Jesteś: ona' : 'Jesteś: on'}</H2>
        {cycle ? <Muted>Średni cykl {cycle.stats.L} dni, okres ok. {cycle.stats.P} dni.</Muted> : null}
      </Card>

      <Card>
        <H2>Kod parowania</H2>
        <Muted>Kod zawiera klucz szyfrujący Waszej pary. Pokazuj go tylko partnerowi, najlepiej siedząc obok siebie. Nigdy nie wysyłaj zrzutu ekranu.</Muted>
        {showQr ? (
          <View style={s.qr}>
            <QRCode value={qrPayload(cfg)} size={240} color={C.fg} backgroundColor="#fff" />
            <Muted style={{ textAlign: 'center' }}>{cfg.role === 'ona' ? 'Niech on zeskanuje ten kod w swojej aplikacji: „Jestem nim” → „Zeskanuj kod”.' : 'Ten kod pozwala połączyć nowy telefon z Waszą parą.'}</Muted>
            <Button title="Ukryj kod" kind="ghost" onPress={() => setShowQr(false)} />
          </View>
        ) : (
          <Button title="Pokaż kod parowania" onPress={() => setShowQr(true)} />
        )}
      </Card>

      <Card>
        <H2>Prywatność</H2>
        <Muted>Okresy, sygnały i notatki są szyfrowane na Waszych telefonach. Serwer przechowuje tylko nieczytelny szyfrogram i nie zna klucza.</Muted>
      </Card>

      <Card>
        <H2>Odłącz ten telefon</H2>
        <Muted>Usuwa klucz z tego telefonu. Dane pary zostają u partnera, a ten telefon możesz połączyć ponownie kodem.</Muted>
        <Button title={sure ? 'Na pewno? Dotknij jeszcze raz' : 'Odłącz'} kind="ghost" onPress={unpair} />
      </Card>
      <Text style={s.ver}>Para · wersja testowa 0.1</Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  qr: { alignItems: 'center', gap: 14, paddingVertical: 8 },
  ver: { textAlign: 'center', color: C.muted, fontSize: 12, paddingBottom: 12 },
});
