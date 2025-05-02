import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="list" options={{ title: 'Listar Itens' }} />
      <Tabs.Screen name="form" options={{ title: 'Novo Item' }} />
    </Tabs>
      );
    }