import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS as C, PH, LEGEND } from './content';
import { addDays, iso, mid } from './cycle';

export function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Button({ title, onPress, kind = 'primary', disabled, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [s.btn, kind === 'ghost' && s.ghost, (pressed || disabled) && { opacity: 0.6 }, style]}
    >
      <Text style={[s.btnText, kind === 'ghost' && { color: C.fg }]}>{title}</Text>
    </Pressable>
  );
}

export const H2 = ({ children }) => <Text style={s.h2}>{children}</Text>;
export const Muted = ({ children, style }) => <Text style={[s.muted, style]}>{children}</Text>;
export const Label = ({ children }) => <Text style={s.label}>{children}</Text>;

export function Legend() {
  return (
    <View style={s.legend}>
      {LEGEND.map(([k, l]) => (
        <View key={k} style={s.legItem}>
          <View style={[s.dot, { backgroundColor: C[k] }]} />
          <Text style={s.legText}>{l}</Text>
        </View>
      ))}
    </View>
  );
}

const WD = ['pn', 'wt', 'śr', 'cz', 'pt', 'sb', 'nd'];

// Siatka dni od poniedziałku. days: tablica Date lub null (puste pole)
export function DayGrid({ days, cycle, todayIso, marked = {}, onPress }) {
  return (
    <View>
      <View style={s.row}>{WD.map((w) => <Text key={w} style={s.wd}>{w}</Text>)}</View>
      <View style={s.grid}>
        {days.map((d, i) => {
          if (!d) return <View key={i} style={s.cellWrap} />;
          const k = iso(d), ph = cycle ? cycle.info(d).ph : null, col = ph ? C[ph] : C.line;
          return (
            <View key={i} style={s.cellWrap}>
              <Pressable
                onPress={onPress ? () => onPress(d) : undefined}
                style={[s.cell, { backgroundColor: ph === 'ov' ? col : col + '38' }, k === todayIso && s.today]}
              >
                <Text style={[s.cellText, ph === 'ov' && { color: '#fff', fontWeight: '700' }]}>{d.getDate()}</Text>
                {marked[k] ? <Text style={s.mark}>{marked[k]}</Text> : null}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function weeksFrom(date, weeks = 4) {
  const t = mid(date), off = (t.getDay() + 6) % 7, first = addDays(t, -off);
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(first, i));
}

export function monthDays(year, month) {
  const first = new Date(year, month, 1, 12), lead = (first.getDay() + 6) % 7;
  const dim = new Date(year, month + 1, 0).getDate();
  return [...Array(lead).fill(null), ...Array.from({ length: dim }, (_, i) => new Date(year, month, i + 1, 12))];
}

export function dayMarks(state) {
  const m = {};
  for (const p of state.periods) m[p.s] = '•';
  for (const d of state.sex) m[d] = (m[d] ? m[d] + ' ' : '') + '♥';
  return m;
}

export const phaseColor = (ph) => C[ph];
export const phaseName = (ph) => PH[ph].name;

const s = StyleSheet.create({
  card: { backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 18, gap: 12 },
  btn: { backgroundColor: C.accent, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16, alignItems: 'center' },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.line },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  h2: { fontSize: 19, fontWeight: '600', color: C.fg },
  muted: { color: C.muted, fontSize: 15, lineHeight: 21 },
  label: { color: C.muted, fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 3 },
  legText: { color: C.muted, fontSize: 13 },
  row: { flexDirection: 'row' },
  wd: { flex: 1, textAlign: 'center', color: C.muted, fontSize: 11, textTransform: 'uppercase', marginBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cellWrap: { width: `${100 / 7}%`, aspectRatio: 1, padding: 2 },
  cell: { flex: 1, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  today: { borderWidth: 2, borderColor: C.fg },
  cellText: { color: C.fg, fontSize: 14, fontVariant: ['tabular-nums'] },
  mark: { position: 'absolute', top: 1, right: 3, fontSize: 9, color: C.ov },
});
