import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { getItems, deleteItem, marcarComoComprado } from '../services/storage';

interface Item {
  id: number;
  descricao: string;
  quantidade: number;
  comprado?: boolean;
}

export default function ListScreen() {
  const [itens, setItens] = useState<Item[]>([]);
  const router = useRouter();

  async function carregar() {
    const dados = await getItems();
    setItens(dados);
  }

  async function excluir(id: number) {
    if (Platform.OS === 'web') {
      const confirmado = window.confirm('Tem certeza que deseja excluir este item?');
      if (confirmado) {
        await deleteItem(id);
        carregar();
      }
    } else {
      Alert.alert(
        'Confirmar exclusão',
        'Tem certeza que deseja excluir este item?',
        [
          {
            text: 'Não',
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: async () => {
              await deleteItem(id);
              carregar();
            },
            style: 'destructive',
          },
        ]
      );
    }
  }

  async function confirmar(id: number) {
    await marcarComoComprado(id);
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Itens para comprar</Text>
      </View>

      <FlatList
        data={itens}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.item,
              item.comprado && { backgroundColor: '#d1ecf1' },
            ]}
          >
            <View>
              <Text style={styles.itemText}>{item.descricao}</Text>
              <Text style={styles.itemSubtext}>Quantidade: {item.quantidade}</Text>
            </View>
            <View style={styles.buttonGroup}>
              {!item.comprado && (
                <TouchableOpacity
                  style={[styles.button, styles.confirmarButton]}
                  onPress={() => confirmar(item.id)}
                >
                  <Text style={styles.buttonText}>Comprado</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.editarButton]}
                onPress={() => router.push({
                  pathname: '/form',
                  params: {
                    id: item.id.toString(),
                    descricao: item.descricao,
                    quantidade: item.quantidade.toString(),
                  },
                })}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.excluirButton]}
                onPress={() => excluir(item.id)}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d63d0e',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemSubtext: {
    fontSize: 14,
    color: '#555',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  confirmarButton: {
    backgroundColor: '#007bff',
  },
  editarButton: {
    backgroundColor: '#28a745',
  },
  excluirButton: {
    backgroundColor: '#ff4d4d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
