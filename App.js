import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS as C } from './src/content';
import { loadPair } from './src/pairStore';
import Welcome from './src/screens/Welcome';
import ScanPair from './src/screens/ScanPair';
import Main from './src/screens/Main';

export default function App() {
  const [cfg, setCfg] = useState(undefined); // undefined = ładuję, null = brak pary
  const [scan, setScan] = useState(false);
  const [firstQr, setFirstQr] = useState(false);

  useEffect(() => { loadPair().then(setCfg); }, []);

  let body;
  if (cfg === undefined) body = <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={C.accent} /></View>;
  else if (cfg) body = <Main cfg={cfg} initialQr={firstQr} onUnpair={() => { setCfg(null); setFirstQr(false); }} />;
  else if (scan) body = <SafeAreaView style={{ flex: 1 }}><ScanPair onBack={() => setScan(false)} onPaired={(c) => { setScan(false); setCfg(c); }} /></SafeAreaView>;
  else body = <SafeAreaView style={{ flex: 1 }}><Welcome onScan={() => setScan(true)} onPaired={(c, o) => { setFirstQr(!!o?.showQr); setCfg(c); }} /></SafeAreaView>;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {body}
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}
