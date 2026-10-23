// Konfiguracja pary na telefonie (id pary, klucz, rola) w sejfie systemowym iOS (Keychain).
import * as SecureStore from 'expo-secure-store';

const KEY = 'para.config.v1';

export async function loadPair() {
  try {
    const v = await SecureStore.getItemAsync(KEY);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

export const savePair = (cfg) => SecureStore.setItemAsync(KEY, JSON.stringify(cfg));
export const clearPair = () => SecureStore.deleteItemAsync(KEY);

// Zawartość kodu QR: id pary + klucz. Pokazuj tylko partnerowi.
export const qrPayload = (cfg) => JSON.stringify({ app: 'para', v: 1, p: cfg.pairId, k: cfg.key });

export function parseQr(text) {
  try {
    const o = JSON.parse(text);
    if (o.app === 'para' && o.v === 1 && o.p && o.k) return { pairId: o.p, key: o.k };
  } catch {}
  return null;
}
