import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveItem, updateItem } from '../services/storage';

export default function FormScreen() {
  const router = useRouter();
  const { id, descricao: paramDesc, quantidade: paramQtd } = useLocalSearchParams();

  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [itemId, setItemId] = useState<number | null>(null);

  useEffect(() => {
    // Se todos os parâmetros existirem, é edição
    if (
      typeof id === 'string' &&
      typeof paramDesc === 'string' &&
      typeof paramQtd === 'string'
    ) {
      setItemId(Number(id));
      setDescricao(paramDesc);
      setQuantidade(paramQtd);
    } else {
      setDescricao('');
      setQuantidade('');
      setItemId(null);
    }
  }, [id, paramDesc, paramQtd]);

  const salvar = async () => {
    if (!descricao || !quantidade) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const item = {
      id: itemId ?? Date.now(),
      descricao,
      quantidade: Number(quantidade),
    };

    if (itemId) {
      await updateItem(item);
    } else {
      await saveItem(item);
    }

    router.push('/list');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Item para comprar</Text>
      </View>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="O que está faltando em casa?"
          placeholderTextColor="#aaa"
          value={descricao}
          onChangeText={setDescricao}
          editable={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite a quantidade"
          placeholderTextColor="#aaa"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
          editable={true}
        />
        <TouchableOpacity style={styles.button} onPress={salvar}>
          <Text style={styles.buttonText}>{itemId ? 'Atualizar' : 'Salvar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d63d0e' },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#002bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
