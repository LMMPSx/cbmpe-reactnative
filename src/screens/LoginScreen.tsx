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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 1. CORREÇÃO: Adicionei { navigation }: any aqui para habilitar a navegação
export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* --- LOGO --- */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logo-bombeiro.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* --- TÍTULO --- */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>PAINEL DE COLETA E</Text>
            <Text style={styles.titleText}>GESTÃO DE OCORRÊNCIAS</Text>
            <Text style={[styles.titleText, styles.subtitleBold]}>SisBMPE</Text>
          </View>

          {/* --- INPUTS --- */}
          <View style={styles.formContainer}>
            {/* Input E-mail/CPF */}
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

            {/* Input Senha */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Esqueceu a Senha */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              // 2. CORREÇÃO: Troquei 'navigator' por 'navigation'
              onPress={() => navigation.navigate("ForgotPassword")} 
            >
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            {/* --- BOTÃO ENTRAR --- */}
            <TouchableOpacity 
              style={styles.loginButton}
              // 3. MELHORIA: Adicionei a ação para ir para a Home ao clicar em Entrar
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 20,
  },

  // Estilos do Logo
  logoContainer: {
    marginBottom: 30,
    marginTop: 20,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },

  // Estilos do Título
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  titleText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 24,
  },
  subtitleBold: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 20,
  },

  // Estilos do Formulário
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
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  // Esqueceu a Senha
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginBottom: 30,
    marginLeft: 5,
  },
  forgotPasswordText: {
    color: "#888",
    fontSize: 14,
  },

  // Botão
  loginButton: {
    backgroundColor: "#C8102E",
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",

    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Sombra para Android
    elevation: 8,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});