import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function NewUserScreen({ navigation, route }: any) {
  // Recebe dados se for Edição
  const { user, isEditing } = route.params || {};

  const [formData, setFormData] = useState({
    nome: user?.name || "",
    cpf: user?.cpf || "",
    email: user?.email || "", // Se tivesse email no objeto anterior
    cargo: user?.perfil || "", // Mapeando 'perfil' para 'cargo'
    senha: "", // Senha geralmente começa vazia na edição para não sobrescrever
    foto: null as string | null,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Função de Foto
  const handlePhotoSelect = async () => {
    Alert.alert("Foto", "Escolha a origem:", [
      {
        text: "Câmera",
        onPress: async () => {
          const res = await ImagePicker.requestCameraPermissionsAsync();
          if (res.granted) {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!result.canceled)
              setFormData({ ...formData, foto: result.assets[0].uri });
          }
        },
      },
      {
        text: "Galeria",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled)
            setFormData({ ...formData, foto: result.assets[0].uri });
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.cpf) {
      Alert.alert("Erro", "Preencha os campos obrigatórios.");
      return;
    }
    const msg = isEditing
      ? "Usuário atualizado com sucesso!"
      : "Usuário cadastrado com sucesso!";
    Alert.alert("Sucesso", msg, [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />

      <CustomHeader
        title={isEditing ? "Editar usuário" : "Novo Usuário"}
        isHome={false}
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* CARTÃO AZUL */}
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#666"
            value={formData.nome}
            onChangeText={(t) => setFormData({ ...formData, nome: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="CPF*"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={formData.cpf}
            onChangeText={(t) => setFormData({ ...formData, cpf: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Cargo"
            placeholderTextColor="#666"
            value={formData.cargo}
            onChangeText={(t) => setFormData({ ...formData, cargo: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(t) => setFormData({ ...formData, email: t })}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor="#666"
              secureTextEntry={!isPasswordVisible}
              value={formData.senha}
              onChangeText={(t) => setFormData({ ...formData, senha: t })}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* BOTÃO DE FOTO CIRCULAR (Grande no centro) */}
          <View style={styles.photoContainer}>
            <TouchableOpacity
              style={styles.photoCircle}
              onPress={handlePhotoSelect}
            >
              {formData.foto ? (
                <Image
                  source={{ uri: formData.foto }}
                  style={styles.photoImage}
                />
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.photoText}>Adicionar foto</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTÕES DE AÇÃO (Cancelar e Salvar) */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? "Salvar" : "Cadastrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomFooter navigation={navigation} activeRoute="Usuario" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { padding: 20, paddingBottom: 40 },

  formCard: {
    backgroundColor: "#001F3F",
    borderRadius: 20,
    padding: 20,
    gap: 15,
    marginBottom: 30,
    paddingBottom: 40, // Espaço extra para a bola da foto
    elevation: 5,
  },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },

  passwordContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: { flex: 1, fontSize: 16, color: "#333", marginRight: 10 },

  // Estilo do Botão de Foto Circular
  photoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "500",
  },

  // Botões Inferiores
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#DDD", // Cinza
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#C8102E", // Vermelho
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  cancelButtonText: { fontSize: 18, color: "#000", fontWeight: "bold" },
  saveButtonText: { fontSize: 18, color: "#FFF", fontWeight: "bold" },
});
