import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function SettingsScreen({ navigation }: any) {
  const [notifNew, setNotifNew] = useState(true);
  const [notifStatus, setNotifStatus] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
      <CustomHeader title="Configurações" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* CONTAINER AZUL ESCURO PRINCIPAL */}
        <View style={styles.settingsCard}>
          {/* Seção Notificações */}
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications" size={24} color="#FFF" />
            <Text style={styles.sectionTitle}>Notificações</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Novas ocorrências</Text>
            <Switch
              value={notifNew}
              onValueChange={setNotifNew}
              trackColor={{ false: "#767577", true: "#000" }}
              thumbColor={notifNew ? "#FFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>
              Alteração do status da ocorrencia
            </Text>
            <Switch
              value={notifStatus}
              onValueChange={setNotifStatus}
              trackColor={{ false: "#767577", true: "#000" }}
              thumbColor={notifStatus ? "#FFF" : "#f4f3f4"}
            />
          </View>

          {/* Seção Configurações Gerais */}
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-sharp" size={24} color="#FFF" />
            <Text style={styles.sectionTitle}>Configurações gerais</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Idioma</Text>
            <Text style={styles.settingValue}>Português</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Tema</Text>
            <Text style={styles.settingValue}>Claro</Text>
          </View>

          {/* Seção Acessibilidade */}
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="universal-access" size={22} color="#FFF" />
            <Text style={styles.sectionTitle}>Acessibilidade</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Alto contraste</Text>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: "#767577", true: "#000" }}
              thumbColor={highContrast ? "#FFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Tamanho da fonte</Text>
            <Text style={styles.settingValue}>Médio</Text>
          </View>
        </View>
      </ScrollView>

      <CustomFooter navigation={navigation} activeRoute="Usuario" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { padding: 20 },

  settingsCard: {
    backgroundColor: "#001F3F",
    borderRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  settingItem: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  settingText: {
    fontSize: 16,
    color: "#000",
    flex: 1, // Para o texto ocupar espaço e empurrar o switch/valor
  },
  settingValue: {
    fontSize: 16,
    color: "#666",
  },
});
