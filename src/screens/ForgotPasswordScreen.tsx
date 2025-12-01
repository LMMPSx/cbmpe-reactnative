import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");

  const handleConfirm = () => {
    // Aqui você futuramente colocará a lógica de enviar o e-mail
    Alert.alert(
      "Sucesso",
      "Se o e-mail estiver cadastrado, você receberá o link em breve."
    );
    navigation.goBack(); // Volta para o login após confirmar
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* LOGO */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logo-bombeiro.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* TÍTULO */}
          <Text style={styles.titleText}>Esqueceu sua senha?</Text>

          {/* INPUT */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="E-mail ou CPF"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            {/* TEXTO DE INSTRUÇÃO */}
            <Text style={styles.instructionText}>
              Um e-mail com uma nova senha será enviado para sua caixa de
              mensagens.
            </Text>

            {/* BOTÃO CONFIRMAR */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
  },

  // Logo
  logoContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 160,
  },

  // Título
  titleText: {
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  // Formulário
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  // Texto de Instrução
  instructionText: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  // Botão Confirmar
  confirmButton: {
    backgroundColor: "#C8102E",
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
