import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS as C, CONTRA, CONTRA_LEVEL } from '../content';
import { Button, Card, H2, Muted } from '../ui';
import { clearPair, qrPayload } from '../pairStore';
import { Header, Screen } from './Shared';

export default function Settings({ cfg, cycle, state, send, now, status, onUnpair, openQr }) {
  const [showQr, setShowQr] = useState(openQr);
  const [sure, setSure] = useState(false);
  const [openContra, setOpenContra] = useState(false);
  const [busy, setBusy] = useState(false);
  const cur = state.contra ? CONTRA[state.contra] : null;

  async function pickContra(m) {
    setBusy(true);
    try { await send({ t: 'contra', m }); setOpenContra(false); } catch {}
    setBusy(false);
  }

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
        <H2>Antykoncepcja</H2>
        {cur ? (
          <View style={[s.curBox, { borderColor: CONTRA_LEVEL[cur.level].color }]}>
            <Text style={[s.curTitle, { color: CONTRA_LEVEL[cur.level].color }]}>{cur.label}</Text>
            {cur.eff ? <Muted style={{ fontSize: 14 }}>Skuteczność przy typowym stosowaniu: {cur.eff}</Muted> : null}
          </View>
        ) : (
          <Muted>Wybierzcie metodę. W dni płodne aplikacja pokaże Wam obojgu, czy macie szerokiej drogi, czy trzeba pilnować zabezpieczenia.</Muted>
        )}
        {openContra ? (
          <View style={{ gap: 6 }}>
            {Object.entries(CONTRA).map(([k, m]) => (
              <Pressable key={k} disabled={busy} onPress={() => pickContra(k)} style={[s.opt, state.contra === k && { borderColor: C.accent, backgroundColor: C.accent + '14' }]}>
                <View style={[s.optDot, { backgroundColor: CONTRA_LEVEL[m.level].color }]} />
                <Text style={s.optText}>{m.label}</Text>
              </Pressable>
            ))}
            <Button title="Anuluj" kind="ghost" onPress={() => setOpenContra(false)} />
          </View>
        ) : (
          <Button title={cur ? 'Zmień metodę' : 'Wybierz metodę'} kind={cur ? 'ghost' : 'primary'} onPress={() => setOpenContra(true)} />
        )}
        <Muted style={{ fontSize: 13 }}>Aplikacja nie jest metodą antykoncepcji ani poradą medyczną. W razie wątpliwości zapytajcie lekarza lub farmaceutę.</Muted>
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
  curBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 2 },
  curTitle: { fontWeight: '700', fontSize: 16 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.line },
  optDot: { width: 10, height: 10, borderRadius: 5 },
  optText: { color: C.fg, fontSize: 16, flex: 1 },
  ver: { textAlign: 'center', color: C.muted, fontSize: 12, paddingBottom: 12 },
});
