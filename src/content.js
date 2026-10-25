// Treści aplikacji: romantyczne i flirtujące, bez treści wprost seksualnych (zgodne z App Store 1.1.4).
export const COLORS = {
  bg: '#f7f2f4', surface: '#ffffff', fg: '#2a1820', muted: '#7a6570', line: '#e8dce1', accent: '#a3245a',
  okres: '#c8344a', foll: '#e9a23b', fert: '#d9558f', ov: '#a3245a', lut: '#7d6bb3', pms: '#5a6ea8',
};

export const LEGEND = [['okres', 'Okres'], ['foll', 'Energia'], ['fert', 'Dni płodne'], ['ov', 'Owulacja'], ['lut', 'Spokój'], ['pms', 'PMS']];

export const PH = {
  okres: {
    name: 'Okres', sub: 'Czas na czułość', pill: 'Czułość',
    adv: 'Wygoda i troska. Przytulenie, ciepło i coś słodkiego.',
    why: 'Skurcze i zmęczenie zwykle obniżają ochotę na bliskość. Liczy się wygoda i poczucie, że ktoś o nią dba.',
    dos: ['Zapytaj, czego potrzebuje, i przynieś to bez dyskusji', 'Termofor, herbata, czekolada, ciepły koc', 'Przejmij obowiązki: obiad, zakupy, zmywanie', 'Wieczór na kanapie z jej serialem'],
    donts: ['Nacisku i podtekstów', 'Komentarzy o humorze w stylu „masz okres?”'],
    msgs: ['Jak się czujesz? Przywieźć coś? Czekolada, termofor, cokolwiek.', 'Dziś ja ogarniam obiad. Ty masz tylko odpoczywać.', 'Kanapa, koc i serial, który wybierzesz. Ja robię herbatę.', 'Kocham Cię. Bez powodu, po prostu przypominam.', 'Wracam z lodami. Jakie?', 'Jesteś piękna. Także w dresie i z termoforem.'],
  },
  foll: {
    name: 'Faza folikularna', sub: 'Energia rośnie', pill: 'Flirt i randka',
    adv: 'Lekki flirt, żarty i randka. Napięcie powoli rośnie.',
    why: 'Po okresie wraca energia i dobry nastrój, a ochota stopniowo rośnie w stronę owulacji. Dobry czas na randki i nowe rzeczy.',
    dos: ['Zaplanuj randkę albo wspólne wyjście', 'Komplementuj — teraz trafia najlepiej', 'Flirtuj w wiadomościach w ciągu dnia', 'Zaproponuj coś nowego: miejsce, aktywność, wyjazd'],
    donts: ['Rutyny i wieczorów przy telefonie'],
    msgs: ['Raport dzienny: poziom tęsknoty za żoną — krytyczny.', 'Wyglądałaś dziś rano obłędnie. Tylko mówię.', 'Randka w piątek? Ty wybierasz miejsce, ja płacę i gapię się na Ciebie.', 'Mam ochotę Cię dziś porwać. Dokąd uciekamy?', 'Pamiętasz naszą pierwszą randkę? Mam ochotę na powtórkę.', 'Uśmiechnąłem się na myśl o Tobie i ktoś w pracy dziwnie na mnie spojrzał.'],
  },
  fert: {
    name: 'Dni płodne', sub: 'Ochota rośnie', pill: 'Czas na romans',
    adv: 'Najlepszy moment na odważniejszy flirt i wspólny wieczór.',
    why: 'W okolicach owulacji badania pokazują wzrost ochoty na bliskość — to szczyt całego cyklu.',
    dos: ['Flirtuj od rana, buduj napięcie przez cały dzień', 'Zaplanuj wieczór tylko dla Was', 'Zadbaj o siebie: prysznic, zapach, dobry humor', 'Inicjuj — teraz jest na to najlepszy czas'],
    donts: ['Wieczoru zajętego czymś innym', 'Zasypiania przed nią'],
    msgs: ['Nie mogę przestać myśleć o dzisiejszym wieczorze.', 'Dziś wieczorem nie planuj nic oprócz mnie.', 'Ostrzegam: jak tylko wejdę do domu, nie zdążysz powiedzieć „cześć”.', 'Cały dzień myślę o Twoich ustach.', 'Nie wiem, jak dotrwam do wieczora.', 'Powiedz mi jedną rzecz, na którą masz dziś ochotę. Zrobię ją.'],
  },
  ov: {
    name: 'Owulacja', sub: 'Szczyt ochoty', pill: 'Szczyt ochoty',
    adv: 'To jest ten dzień. Bądź blisko i bądź zdecydowany.',
    why: 'Szczyt cyklu. Według większości badań ochota jest teraz najwyższa, a ona czuje się najbardziej atrakcyjna.',
    dos: ['Przyjdź wcześniej do domu', 'Bądź zdecydowany i inicjuj', 'Pamiętaj: to też najpłodniejszy dzień cyklu'],
    donts: ['Czekania aż ona zacznie', 'Wymówek typu „jestem zmęczony”'],
    msgs: ['Dziś wieczorem jesteś moja. Odwołaj wszystko.', 'Mam na Ciebie taką ochotę, że ciężko mi się skupić na pracy.', 'Każda minuta do wieczora to tortura.', 'Wyłączam telefon o 21. Potem jesteś tylko Ty.', 'Jak tylko zamkną się drzwi, jesteś moja.'],
  },
  lut: {
    name: 'Faza lutealna', sub: 'Spokojniej', pill: 'Czułość z iskrą',
    adv: 'Bliskość i czułość. Zacznij od przytulenia, reszta przyjdzie sama.',
    why: 'Po owulacji ochota zwykle spada, ale nie znika — raz czy dwa razy w tygodniu to normalne tempo. Czułość trafia teraz najlepiej.',
    dos: ['Masaż pleców albo stóp bez oczekiwań', 'Czułe wiadomości w ciągu dnia', 'Spokojne wieczory w domu', 'Przytulanie bez podtekstu'],
    donts: ['Nacisku, gdy mówi „nie dziś”'],
    msgs: ['Myślę o Tobie. Bez powodu, po prostu.', 'Masażyk wieczorem? Zobaczymy, gdzie się skończy.', 'Zrobię Ci kąpiel z pianą. Ty tylko przyjdź.', 'Wieczorem film i Twoje stopy na moich kolanach?', 'Jesteś najlepszym, co mi się przytrafiło.', 'Dziś leniwy wieczór i spanie w objęciach? Brzmi jak plan.'],
  },
  pms: {
    name: 'Przed okresem', sub: 'PMS — ostrożnie', pill: 'Delikatnie',
    adv: 'Cierpliwość, czekolada i koc.',
    why: 'Około połowa kobiet ma przed okresem gorszy nastrój, drażliwość lub niepokój. To objawy hormonalne, nie wina partnera.',
    dos: ['Zapytaj: „Jak mogę Ci dziś pomóc?”', 'Słuchaj bez oceniania i bez naprawiania', 'Odciąż ją w obowiązkach domowych', 'Odłóż poważne rozmowy na później'],
    donts: ['Brania jej humoru do siebie', 'Żartów z PMS'],
    msgs: ['Jak mogę Ci dziś pomóc?', 'Wieczór bez obowiązków: ja zmywam, Ty odpoczywasz.', 'Przytulić czy dać spokój? Obie odpowiedzi są w porządku.', 'Kocham Cię też wtedy, kiedy masz gorszy dzień.', 'Kupiłem Twoją ulubioną czekoladę. Leży w szafce.'],
  },
};

export const SIGNALS = {
  chce: { label: 'Mam ochotę', emoji: '🔥', forHim: 'Ona ma dziś ochotę. Nie przegap tego.' },
  przytul: { label: 'Chcę się przytulić', emoji: '🤗', forHim: 'Dziś czułość: przytulanie, bez oczekiwań.' },
  nie: { label: 'Dziś odpoczywam', emoji: '🌙', forHim: 'Dziś daj jej odpocząć. Zapytaj, czy czegoś potrzebuje.' },
};

// Antykoncepcja. Poziomy: safe (szerokiej drogi), watch (pilnuj), risk (ryzyko), baby (staracie się).
// Skuteczność przy typowym stosowaniu (odsetek par bez ciąży w ciągu roku), wg CDC.
export const CONTRA = {
  brak: { label: 'Bez zabezpieczenia', level: 'risk', eff: null,
    tip: 'W dni płodne ryzyko ciąży jest najwyższe. Jeśli nie planujecie dziecka, zabezpieczcie się.' },
  dziecko: { label: 'Staramy się o dziecko', level: 'baby', eff: null,
    tip: 'To najlepsze dni na poczęcie. Stosunek co 1–2 dni w dniach płodnych daje największe szanse.' },
  prezerwatywa: { label: 'Prezerwatywa', level: 'watch', eff: 'ok. 87%',
    tip: 'Prezerwatywa przy każdym stosunku, od początku do końca. Sprawdź zapas i datę ważności.' },
  tabletki: { label: 'Tabletki antykoncepcyjne', level: 'watch', eff: 'ok. 93%', daily: true, suppresses: true,
    tip: 'Pilnuj tabletki codziennie o stałej porze. Po pominiętej tabletce, wymiotach lub biegunce sprawdź ulotkę i używajcie dodatkowo prezerwatywy.' },
  hormonalna: { label: 'Plaster, krążek lub zastrzyk', level: 'watch', eff: '93–96%', suppresses: true,
    tip: 'Pilnuj terminu zmiany plastra, krążka albo kolejnego zastrzyku. Po spóźnieniu sprawdź ulotkę.' },
  wkladka_horm: { label: 'Wkładka hormonalna', level: 'safe', eff: 'ponad 99%',
    tip: 'Szerokiej drogi. Pamiętajcie tylko o kontrolach u ginekologa i terminie wymiany wkładki.' },
  wkladka_mied: { label: 'Wkładka miedziana', level: 'safe', eff: 'ponad 99%',
    tip: 'Szerokiej drogi. Pamiętajcie tylko o kontrolach u ginekologa i terminie wymiany wkładki.' },
  implant: { label: 'Implant', level: 'safe', eff: 'ponad 99%', suppresses: true,
    tip: 'Szerokiej drogi. Pamiętajcie o terminie wymiany implantu.' },
  wazektomia_ok: { label: 'Wazektomia (potwierdzona badaniem)', level: 'safe', eff: 'ponad 99%',
    tip: 'Szerokiej drogi. Badanie nasienia potwierdziło brak plemników.' },
  wazektomia_czeka: { label: 'Wazektomia (przed badaniem kontrolnym)', level: 'watch', eff: null,
    tip: 'Po wazektomii plemniki są jeszcze obecne przez kilka miesięcy. Do czasu badania nasienia, które potwierdzi ich brak, używajcie innej antykoncepcji.' },
  naturalne: { label: 'Stosunek przerywany lub metody naturalne', level: 'risk', eff: '78–98%',
    tip: 'Te metody są zawodne, a w dni płodne ryzyko jest najwyższe. Rozważcie prezerwatywę.' },
};

export const CONTRA_LEVEL = {
  safe: { title: 'Szerokiej drogi', color: '#2f8f5b' },
  watch: { title: 'Pilnujcie zabezpieczenia', color: '#c98a1b' },
  risk: { title: 'Uwaga: dni płodne', color: '#c8344a' },
  baby: { title: 'Najlepszy czas na dziecko', color: '#d9558f' },
};
