import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'crud-itens';

export async function getItems() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveItem(item: any) {
  const items = await getItems();
  items.push(item);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function deleteItem(id: number) {
  const items = await getItems();
  const newItems = items.filter((item: any) => item.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
}

export async function marcarComoComprado(id: number) {
  const items = await getItems();
  const atualizados = items.map((item: any) =>
    item.id === id ? { ...item, comprado: true } : item
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
}

export async function updateItem(updatedItem: any) {
  const items = await getItems();
  const newItems = items.map((item: any) =>
    item.id === updatedItem.id ? updatedItem : item
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
}