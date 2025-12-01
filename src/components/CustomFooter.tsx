import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// 1. Importamos o hook da Safe Area
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FooterProps {
  navigation: any;
  activeRoute: string;
}

export default function CustomFooter({ navigation, activeRoute }: FooterProps) {
  // 2. Pegamos as medidas da área segura
  const insets = useSafeAreaInsets();

  const getColor = (route: string) =>
    activeRoute === route ? "#FFCC00" : "#FFF";

  return (
    // 3. Aplicamos paddingBottom dinâmico e somamos na altura total
    <View
      style={[
        styles.footer,
        { paddingBottom: insets.bottom, height: 70 + insets.bottom },
      ]}
    >
      {/* Botão INÍCIO */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home" size={28} color={getColor("Home")} />
        <Text style={[styles.footerText, { color: getColor("Home") }]}>
          Início
        </Text>
      </TouchableOpacity>

      {/* Botão OCORRÊNCIAS */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("OccurrenceList")}
      >
        <MaterialIcons
          name="report-problem"
          size={28}
          color={getColor("Ocorrencias")}
        />
        <Text style={[styles.footerText, { color: getColor("Ocorrencias") }]}>
          Ocorrências
        </Text>
      </TouchableOpacity>

      {/* Botão RELATÓRIOS */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Reports")}
      >
        <Ionicons name="stats-chart" size={28} color={getColor("Relatorios")} />
        <Text style={[styles.footerText, { color: getColor("Relatorios") }]}>
          Relatórios
        </Text>
      </TouchableOpacity>

      {/* Botão USUÁRIO (Agora vai para Gestão de Usuários direto) */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("UserManagement")} // <--- ALTERADO AQUI
      >
        <Ionicons name="person" size={28} color={getColor("Usuario")} />
        <Text style={[styles.footerText, { color: getColor("Usuario") }]}>
          Usuário
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    // A altura base é definida no style inline acima (70 + insets)
    backgroundColor: "#001F3F",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start", // Importante: alinhar ao topo
    paddingTop: 10,
    width: "100%",
  },
  footerItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 10,
    marginTop: 4,
  },
});
