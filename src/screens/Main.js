import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS as C } from '../content';
import { addEvent, fetchEvents, reduce, subscribe } from '../events';
import { ensureSession } from '../supabase';
import { iso, makeCycle, mid } from '../cycle';
import TodayOna from './TodayOna';
import TodayOn from './TodayOn';
import CalendarScreen from './CalendarScreen';
import Settings from './Settings';

const TABS = [['dzis', 'Dziś'], ['kal', 'Kalendarz'], ['ust', 'Ustawienia']];

export default function Main({ cfg, onUnpair, initialQr }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(initialQr ? 'ust' : 'dzis');
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [now, setNow] = useState(mid(new Date()));
  const [me, setMe] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const sess = await ensureSession();
      setMe(sess.user.id);
      setEvents(await fetchEvents(cfg));
      setStatus('ok');
    } catch {
      setStatus('error');
    }
    setNow(mid(new Date()));
  }, [cfg]);

  useEffect(() => {
    refresh();
    const unsub = subscribe(cfg, refresh);
    const app = AppState.addEventListener('change', (st) => st === 'active' && refresh());
    return () => { unsub(); app.remove(); };
  }, [cfg, refresh]);

  const state = useMemo(() => reduce(events), [events]);
  const cycle = useMemo(() => makeCycle(state.periods), [state.periods]);
  const todayIso = iso(now);
  const signal = [...state.signals].reverse().find((x) => x.d === todayIso) || null;

  const send = async (payload) => { await addEvent(cfg, payload); await refresh(); };

  const props = { cfg, cycle, state, now, todayIso, signal, send, me, goTo: setTab, status, refresh };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {tab === 'dzis' && (cfg.role === 'ona' ? <TodayOna {...props} /> : <TodayOn {...props} />)}
        {tab === 'kal' && <CalendarScreen {...props} />}
        {tab === 'ust' && <Settings {...props} onUnpair={onUnpair} openQr={!!initialQr} />}
      </View>
      <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {TABS.map(([k, l]) => (
          <Pressable key={k} onPress={() => setTab(k)} style={s.tab} accessibilityRole="tab" accessibilityState={{ selected: tab === k }}>
            <Text style={[s.tabText, tab === k && s.tabOn]}>{l}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: 1, borderColor: C.line, backgroundColor: C.surface, paddingTop: 10 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  tabText: { color: C.muted, fontSize: 15, fontWeight: '500' },
  tabOn: { color: C.accent, fontWeight: '700' },
});
