# Para

Wspólny kalendarz cyklu dla pary. Ona zaznacza okresy i daje znać, jak się czuje, a on dostaje prognozę i wskazówki na każdy dzień. Dane są szyfrowane end-to-end: klucz pary istnieje tylko na dwóch telefonach, a serwer przechowuje wyłącznie szyfrogram.

## Uruchomienie

1. **Supabase:** SQL Editor → New query → wklej `supabase/schema.sql` → Run.
2. **Supabase:** Authentication → Sign In / Providers → włącz **Allow anonymous sign-ins**.
3. Wpisz Project URL i klucz anon public w `src/config.js`.
4. Otwórz projekt w Expo Snack (Import git repository) i zeskanuj kod QR aplikacją Expo Go.

## Struktura

- `src/crypto.js`: szyfrowanie (tweetnacl secretbox)
- `src/cycle.js`: prognoza cyklu
- `src/events.js`: zaszyfrowane wpisy w Supabase
- `src/content.js`: teksty i wskazówki
- `src/screens/`: ekrany
