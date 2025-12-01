import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

// Importando os componentes reutilizáveis
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />

      {/* HEADER COMPONENTE (isHome=true mostra o Logo) */}
      <CustomHeader
        title="Inicio- SisBMPE"
        isHome={true}
        navigation={navigation}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.actionButton, styles.btnRed]}
          onPress={() => navigation.navigate("NewOccurrence")}
        >
          <Text style={[styles.btnText, { color: "#FFF" }]}>
            Nova ocorrência
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.btnYellow]}
          onPress={() => navigation.navigate("Reports")} // <--- CONECTE AQUI
        >
          <Text style={[styles.btnText, { color: "#000" }]}>
            Gerar relatório{"\n"}(PDF)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.btnBlue]}
          onPress={() => navigation.navigate("MapScreen")} // <--- CONECTE AQUI
        >
          <Text style={[styles.btnText, { color: "#000" }]}>
            Mapa de{"\n"}Ocorrências
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER COMPONENTE (activeRoute pinta o ícone de amarelo) */}
      <CustomFooter navigation={navigation} activeRoute="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 30,
  },
  actionButton: {
    width: "85%",
    height: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  btnRed: { backgroundColor: "#C8102E" },
  btnYellow: { backgroundColor: "#FFCC00" },
  btnBlue: { backgroundColor: "#87CEEB" },
  btnText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
