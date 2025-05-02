import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="list"
        options={{
          title: 'Lista de compras',
        }}
      />
      <Tabs.Screen
        name="form"
        options={{
          title: 'Adicionar itens',
        }}
      />
    </Tabs>
  );
}
