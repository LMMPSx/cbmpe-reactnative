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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart, PieChart } from "react-native-chart-kit"; // <--- Importando gráficos

// Componentes
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function ReportsScreen({ navigation }: any) {
  const screenWidth = Dimensions.get("window").width;

  // --- DADOS PARA O GRÁFICO DE PIZZA (Por Tipo) ---
  const dataPizza = [
    {
      name: "Incêndio",
      population: 45,
      color: "#C8102E", // Vermelho
      legendFontColor: "#000",
      legendFontSize: 10,
    },
    {
      name: "Resgate",
      population: 30,
      color: "#FFCC00", // Amarelo
      legendFontColor: "#000",
      legendFontSize: 10,
    },
    {
      name: "Outros",
      population: 25,
      color: "#001F3F", // Azul
      legendFontColor: "#000",
      legendFontSize: 10,
    },
  ];

  // --- DADOS PARA O GRÁFICO DE BARRAS (Por Região) ---
  const dataBarras = {
    labels: ["Olinda", "Recife", "Paulista", "Jaboatão"],
    datasets: [
      {
        data: [20, 45, 28, 80], // Quantidade de ocorrências
      },
    ],
  };

  // Configuração visual do Gráfico de Barras
  const chartConfigBarras = {
    backgroundGradientFrom: "#D9D9D9",
    backgroundGradientTo: "#D9D9D9",
    color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`, // Barras em Azul Escuro (#001F3F)
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0, // Sem casas decimais
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Texto preto
  };

  // Dados da Tabela
  const tableData = [
    {
      id: 1,
      prioridade: "Alta",
      tipo: "Incêndio",
      periodo: "30/08 - 12:50",
      regiao: "Olinda",
      status: "Em aberto",
    },
    {
      id: 2,
      prioridade: "Média",
      tipo: "Resgate",
      periodo: "30/08 - 13:00",
      regiao: "Olinda",
      status: "Em aberto",
    },
    {
      id: 3,
      prioridade: "Baixa",
      tipo: "Treino",
      periodo: "30/08 - 15:00",
      regiao: "Olinda",
      status: "Em aberto",
    },
  ];

  const handleGeneratePDF = () => {
    Alert.alert("Sucesso", "O relatório PDF foi gerado e salvo.");
  };

  const handleExportCSV = () => {
    Alert.alert("Sucesso", "O arquivo CSV foi exportado.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
      <CustomHeader
        title="Relatórios - SisBMPE"
        isHome={false}
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- LINHA 1: KPI CARDS --- */}
        <View style={styles.kpiContainer}>
          <View style={[styles.kpiCard, { backgroundColor: "#C8102E" }]}>
            <Text style={styles.kpiTitle}>Total{"\n"}ocorrências</Text>
            <Text style={styles.kpiValue}>145</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: "#FFCC00" }]}>
            <Text style={[styles.kpiTitle, { color: "#000" }]}>
              Tempo{"\n"}médio
            </Text>
            <Text style={[styles.kpiValue, { color: "#000" }]}>12min</Text>
          </View>

          {/* Card Pizza Adaptado (Sem legenda para caber no quadrado pequeno) */}
          <View
            style={[
              styles.kpiCard,
              { backgroundColor: "#87CEEB", padding: 0, overflow: "hidden" },
            ]}
          >
            <Text
              style={[
                styles.kpiTitle,
                { color: "#000", marginTop: 5, fontSize: 10 },
              ]}
            >
              Por Tipo
            </Text>
            <PieChart
              data={dataPizza}
              width={100}
              height={80}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"25"}
              center={[0, 0]}
              absolute
              hasLegend={false} // Desativei a legenda para não quebrar o layout pequeno
            />
          </View>
        </View>

        {/* --- LINHA 2: GRÁFICO DE BARRAS --- */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ocorrências por região</Text>

          <BarChart
            data={dataBarras}
            width={screenWidth - 60} // Largura da tela menos padding
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfigBarras}
            verticalLabelRotation={0}
            fromZero={true}
            showValuesOnTopOfBars={true} // Mostra o número em cima da barra
          />
        </View>

        {/* --- LINHA 3: TABELA --- */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.columnHeader}>Prioridade</Text>
            <Text style={styles.columnHeader}>Tipo</Text>
            <Text style={styles.columnHeader}>Periodo</Text>
            <Text style={styles.columnHeader}>Região</Text>
            <Text style={styles.columnHeader}>Status</Text>
          </View>
          <View style={styles.tableBody}>
            {tableData.map((row, index) => (
              <View
                key={row.id}
                style={[
                  styles.tableRow,
                  index === tableData.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.cellText}>{row.prioridade}</Text>
                <Text style={styles.cellText}>{row.tipo}</Text>
                <Text style={styles.cellText}>{row.periodo}</Text>
                <Text style={styles.cellText}>{row.regiao}</Text>
                <Text style={styles.cellText}>{row.status}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- LINHA 4: BOTÕES --- */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnPdf} onPress={handleGeneratePDF}>
            <Text style={styles.btnTextWhite}>Gerar{"\n"}relatório(PDF)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCsv} onPress={handleExportCSV}>
            <Text style={styles.btnTextBlack}>Exportar CSV</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomFooter navigation={navigation} activeRoute="Relatorios" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // KPI
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  kpiCard: {
    width: "31%",
    height: 110,
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  kpiTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 5,
  },
  kpiValue: { fontSize: 28, fontWeight: "bold", color: "#FFF" },

  // CHART CARD
  chartCard: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },

  // TABLE
  tableContainer: {
    backgroundColor: "#001F3F",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    elevation: 4,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  columnHeader: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableBody: { backgroundColor: "#FFF", borderRadius: 10, overflow: "hidden" },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    minHeight: 35,
    alignItems: "center",
  },
  cellText: { fontSize: 9, color: "#000", flex: 1, textAlign: "center" },

  // ACTIONS
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 15,
  },
  btnPdf: {
    flex: 1,
    backgroundColor: "#C8102E",
    borderRadius: 15,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  btnCsv: {
    flex: 1,
    backgroundColor: "#FFCC00",
    borderRadius: 15,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  btnTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  btnTextBlack: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
