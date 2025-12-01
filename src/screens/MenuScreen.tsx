import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

// Componentes
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function MenuScreen({ navigation }: any) {
  // Dados do Usuário Logado (Mock)
  const currentUser = {
    name: "Sgt. Peixoto",
    cpf: "123.456.789-00",
    email: "peixoto.bombeiros@pe.gov.br",
    perfil: "Comandante", // Será mapeado para o campo Cargo
  };

  const handleLogout = () => {
    Alert.alert("Sair do Sistema", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />

      <CustomHeader title="Menu" isHome={false} navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- CARTÃO DE PERFIL --- */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color="#000" />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileText}>Nome: {currentUser.name}</Text>
            <Text style={styles.profileText}>CPF: {currentUser.cpf}</Text>
            <Text style={styles.profileText}>Cargo: {currentUser.perfil}</Text>
          </View>

          {/* Botão Editar Pequeno (CONECTADO) */}
          <TouchableOpacity
            style={styles.editProfileButton}
            // AQUI A MÁGICA: Envia os dados do usuário atual para edição
            onPress={() =>
              navigation.navigate("NewUser", {
                user: currentUser,
                isEditing: true,
              })
            }
          >
            <MaterialIcons name="edit" size={16} color="#000" />
            <Text style={styles.editProfileText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* --- OPÇÕES DO MENU --- */}
        <View style={styles.menuOptions}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="settings-outline" size={28} color="#666" />
            </View>
            <Text style={styles.menuButtonText}>Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("VirtualAssistant")}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="account-voice"
                size={28}
                color="#666"
              />
            </View>
            <Text style={styles.menuButtonText}>Assistente virtual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("AuditLogs")}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5 name="clipboard-check" size={28} color="#666" />
            </View>
            <Text style={styles.menuButtonText}>Auditoria & Logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("About")}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5 name="question" size={28} color="#666" />
            </View>
            <Text style={styles.menuButtonText}>Sobre</Text>
          </TouchableOpacity>
        </View>

        {/* --- BOTÃO SAIR --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <CustomFooter navigation={navigation} activeRoute="" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#001F3F",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
    height: 120,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileText: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 2,
  },
  editProfileButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  editProfileText: {
    fontSize: 10,
    color: "#000",
    marginLeft: 2,
  },
  menuOptions: {
    gap: 15,
    marginBottom: 40,
  },
  menuButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 10,
  },
  menuButtonText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#C8102E",
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
    marginBottom: 20,
    elevation: 3,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
