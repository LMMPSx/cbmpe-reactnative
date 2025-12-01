import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function AuditLogsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
      <CustomHeader title="Auditoria & Logs" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterBox}>
              <Text style={styles.filterText}>Período</Text>
              <Ionicons name="chevron-down-circle" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBox}>
              <Text style={styles.filterText}>Usuário</Text>
              <Ionicons name="chevron-down-circle" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterBox}>
              <Text style={styles.filterText}>Ação realizada</Text>
              <Ionicons name="chevron-down-circle" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBox}>
              <Text style={styles.filterText}>Módulo</Text>
              <Ionicons name="chevron-down-circle" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnFiltrar}>
            <Text style={styles.btnFiltrarText}>Filtrar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista (Skeleton/Placeholders) */}
        <View style={styles.listContainer}>
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={styles.logItemPlaceholder} />
          ))}
        </View>

        <Text style={styles.paginationText}>{"<< Pagina 1 de x >>"}</Text>

        {/* Botões de Exportação */}
        <View style={styles.exportRow}>
          <TouchableOpacity style={styles.exportBtn}>
            <Text style={styles.exportText}>Exportar CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportBtn}>
            <Text style={styles.exportText}>Exportar PDF</Text>
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

  // Filtros
  filtersContainer: { marginBottom: 20 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterBox: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    height: 40,
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  filterText: { fontSize: 14, color: "#333" },
  btnFiltrar: {
    backgroundColor: "#FFCC00",
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  btnFiltrarText: { fontWeight: "bold", color: "#000" },

  // Lista
  listContainer: { gap: 15, marginBottom: 10 },
  logItemPlaceholder: {
    height: 50,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
  paginationText: {
    textAlign: "right",
    color: "#333",
    marginBottom: 20,
    fontSize: 12,
  },

  // Exportar
  exportRow: { flexDirection: "row", justifyContent: "space-between", gap: 15 },
  exportBtn: {
    flex: 1,
    backgroundColor: "#FFCC00",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  exportText: { fontSize: 16, fontWeight: "bold", color: "#000" },
});
