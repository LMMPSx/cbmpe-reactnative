import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  // Platform removido, não precisamos mais dele para o padding
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// 1. Importamos o hook
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  isHome?: boolean;
  navigation?: any;
}

export default function CustomHeader({
  title,
  isHome = false,
  navigation,
}: HeaderProps) {
  // 2. Pegamos as medidas seguras
  const insets = useSafeAreaInsets();

  return (
    // 3. Aplicamos o paddingTop dinâmico no container principal
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      {/* 4. Criamos uma View interna para alinhar o conteúdo com altura fixa */}
      <View style={styles.headerContent}>
        {/* LADO ESQUERDO */}
        {isHome ? (
          <View style={styles.headerLeftHome}>
            <Image
              source={require("../../assets/logo-bombeiro.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitleHome}>{title}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.headerLeftBack}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonCircle}>
              <Ionicons name="chevron-back" size={24} color="#001F3F" />
            </View>
            <Text style={styles.headerBackText}>Voltar</Text>
          </TouchableOpacity>
        )}

        {/* TÍTULO CENTRAL */}
        {!isHome && (
          <Text style={styles.headerTitleCenter} numberOfLines={1}>
            {title}
          </Text>
        )}

        {/* LADO DIREITO */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("MenuScreen")}
        >
          <Ionicons name="menu" size={32} color="#FFF" />
          <Text style={styles.menuText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container externo (fundo azul)
  headerContainer: {
    backgroundColor: "#001F3F",
    zIndex: 100, // Garante que fique por cima do conteúdo ao rolar
    // A altura total será automática: insets.top + altura do conteúdo
  },
  // Conteúdo interno (Botões e Textos)
  headerContent: {
    height: 60, // Altura fixa para a barra de ferramentas
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  headerLeftHome: { flexDirection: "row", alignItems: "center" },
  headerLogo: { width: 40, height: 40, marginRight: 10 },
  headerTitleHome: { color: "#FFF", fontSize: 20, fontWeight: "bold" },

  headerLeftBack: { alignItems: "center", justifyContent: "center", width: 50 },
  backButtonCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackText: { color: "#FFF", fontSize: 10, marginTop: 2 },

  headerTitleCenter: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },

  menuButton: { alignItems: "center", width: 50 },
  menuText: { color: "#FFF", fontSize: 10, marginTop: -2 },
});
