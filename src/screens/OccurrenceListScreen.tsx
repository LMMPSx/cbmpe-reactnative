import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function OccurrenceListScreen({ navigation }: any) {
  const [activeModal, setActiveModal] = useState<"filter" | "search" | null>(null);
  const [searchText, setSearchText] = useState("");
  
  // --- ESTADO DOS FILTROS ---
  const [filters, setFilters] = useState({
    priority: null as string | null,
    period: null as string | null,
    type: "Incêndio",
    region: "Olinda",
    status: "Em aberto",
  });

  // --- DADOS COMPLETOS MOCKADOS ---
  const allOccurrences = [
    {
      id: "1",
      type: "Incêndio",
      protocolo: "2025-00145",
      date: "30/06/2025 - 12:50",
      region: "Olinda",
      status: "Em aberto",
      priority: "high",
      description: "Incêndio de médio porte em vegetação próxima à rodovia PE-15. Risco de fumaça na pista.",
      responsavel: "Sgt. Peixoto (Viatura ABT-12)",
      lat: -7.9964,
      lng: -34.8419,
    },
    {
      id: "2",
      type: "Resgate de animal",
      protocolo: "2025-00146",
      date: "30/06/2025 - 13:00",
      region: "Olinda",
      status: "Em aberto",
      priority: "medium",
      description: "Gato preso em topo de árvore de 10 metros. Solicitante informou que o animal está lá há 2 dias.",
      responsavel: "Sub. Ten. Oliveira (Viatura ABS-05)",
      lat: -8.0153,
      lng: -34.8507,
    },
    {
      id: "3",
      type: "Treinamento",
      protocolo: "2025-00147",
      date: "30/06/2025 - 15:00",
      region: "Olinda",
      status: "Em aberto",
      priority: "low",
      description: "Treinamento de salvamento em altura para novos cadetes.",
      responsavel: "Maj. Roberto (Equipe Alpha)",
      lat: -8.0089,
      lng: -34.8553,
    },
  ];

  // --- ESTATÍSTICAS DE PRIORIDADE ---
  const priorityStats = {
    high: allOccurrences.filter(o => o.priority === "high").length,
    medium: allOccurrences.filter(o => o.priority === "medium").length,
    low: allOccurrences.filter(o => o.priority === "low").length,
  };

  // --- FUNÇÃO DE FILTRAGEM ---
  const [filteredOccurrences, setFilteredOccurrences] = useState(allOccurrences);

  const applyFilters = () => {
    let result = [...allOccurrences];
    
    // Filtro por texto de pesquisa
    if (searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase();
      result = result.filter(item => 
        item.type.toLowerCase().includes(searchLower) ||
        item.protocolo.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.region.toLowerCase().includes(searchLower)
      );
    }
    
    // Aplicar filtros selecionados
    if (filters.type && filters.type !== "Todos") {
      result = result.filter(item => item.type === filters.type);
    }
    
    if (filters.region && filters.region !== "Todas") {
      result = result.filter(item => item.region === filters.region);
    }
    
    if (filters.status && filters.status !== "Todos") {
      result = result.filter(item => item.status === filters.status);
    }
    
    if (filters.priority) {
      result = result.filter(item => item.priority === filters.priority);
    }
    
    setFilteredOccurrences(result);
  };

  // --- INICIALIZAÇÃO DOS FILTROS ---
  useEffect(() => {
    applyFilters();
  }, [filters, searchText]);

  // --- FUNÇÕES PARA FILTROS ---
  const handleFilterSelect = (filterType: string, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Função específica para prioridade com seleção
  const handlePriorityFilter = () => {
    Alert.alert(
      "Filtrar por Prioridade",
      "Selecione a prioridade:",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Alta", 
          onPress: () => handleFilterSelect("priority", "high"),
          style: filters.priority === "high" ? "default" : "default"
        },
        { 
          text: "Média", 
          onPress: () => handleFilterSelect("priority", "medium") 
        },
        { 
          text: "Baixa", 
          onPress: () => handleFilterSelect("priority", "low") 
        },
        { 
          text: "Limpar filtro", 
          onPress: () => handleFilterSelect("priority", null),
          style: "destructive"
        }
      ]
    );
  };

  // Função para tipo
  const handleTypeFilter = () => {
    const types = Array.from(new Set(allOccurrences.map(o => o.type)));
    Alert.alert(
      "Filtrar por Tipo",
      "Selecione o tipo:",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Todos", 
          onPress: () => handleFilterSelect("type", "Todos") 
        },
        ...types.map(type => ({
          text: type,
          onPress: () => handleFilterSelect("type", type)
        }))
      ]
    );
  };

  // Função para região
  const handleRegionFilter = () => {
    const regions = Array.from(new Set(allOccurrences.map(o => o.region)));
    Alert.alert(
      "Filtrar por Região",
      "Selecione a região:",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Todas", 
          onPress: () => handleFilterSelect("region", "Todas") 
        },
        ...regions.map(region => ({
          text: region,
          onPress: () => handleFilterSelect("region", region)
        }))
      ]
    );
  };

  // Função para status
  const handleStatusFilter = () => {
    const statuses = Array.from(new Set(allOccurrences.map(o => o.status)));
    Alert.alert(
      "Filtrar por Status",
      "Selecione o status:",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Todos", 
          onPress: () => handleFilterSelect("status", "Todos") 
        },
        ...statuses.map(status => ({
          text: status,
          onPress: () => handleFilterSelect("status", status)
        }))
      ]
    );
  };

  const getPriorityLabel = (priority: string | null) => {
    if (!priority) return "Todas";
    switch (priority) {
      case "high": return "Alta";
      case "medium": return "Média";
      case "low": return "Baixa";
      default: return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "#C8102E";
      case "medium": return "#FFCC00";
      case "low": return "#87CEEB";
      default: return "#999";
    }
  };

  const toggleModal = (modalName: "filter" | "search") => {
    setActiveModal(activeModal === modalName ? null : modalName);
  };

  const clearAllFilters = () => {
    setFilters({
      priority: null,
      period: null,
      type: "Incêndio",
      region: "Olinda",
      status: "Em aberto",
    });
    setSearchText("");
    setActiveModal(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
      <CustomHeader
        title="Gestão de ocorrências - SisBMPE"
        isHome={false}
        navigation={navigation}
      />

      <View style={{ flex: 1, position: "relative" }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Prioridades */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Prioridade</Text>
            <TouchableOpacity onPress={clearAllFilters}>
              <Ionicons name="refresh" size={22} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.priorityRow}>
            <View style={[styles.priorityCard, { backgroundColor: "#C8102E" }]}>
              <Text style={styles.priorityNumber}>{priorityStats.high}</Text>
              <Text style={styles.priorityLabel}>Alta</Text>
            </View>
            <View style={[styles.priorityCard, { backgroundColor: "#FFCC00" }]}>
              <Text style={[styles.priorityNumber, { color: "#000" }]}>{priorityStats.medium}</Text>
              <Text style={[styles.priorityLabel, { color: "#000" }]}>Média</Text>
            </View>
            <View style={[styles.priorityCard, { backgroundColor: "#87CEEB" }]}>
              <Text style={[styles.priorityNumber, { color: "#000" }]}>{priorityStats.low}</Text>
              <Text style={[styles.priorityLabel, { color: "#000" }]}>Baixa</Text>
            </View>
          </View>

          {/* Filtros */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeModal === "filter" && styles.activeButton,
              ]}
              onPress={() => toggleModal("filter")}
            >
              <Ionicons name="filter" size={20} color="#000" />
              <Text style={styles.filterText}>Filtrar por:</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.searchButton,
                activeModal === "search" && styles.activeButton,
              ]}
              onPress={() => toggleModal("search")}
            >
              <Ionicons name="search" size={20} color="#000" />
              <Text style={styles.filterText}>Pesquisar</Text>
            </TouchableOpacity>
          </View>

          {/* Lista */}
          <View style={styles.listContainer}>
            {filteredOccurrences.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.cardItem}
                onPress={() =>
                  navigation.navigate("OccurrenceDetail", { occurrence: item })
                }
              >
                <View style={styles.cardContentLeft}>
                  <Text style={styles.cardTypeText}>Tipo: {item.type}</Text>
                  <Text style={styles.cardDetailText}>Data/Hora: {item.date}</Text>
                  <Text style={styles.cardDetailText}>Região: {item.region}</Text>
                  <Text style={styles.cardStatusText}>Status: {item.status}</Text>
                </View>
                <View
                  style={[
                    styles.cardIconBox,
                    { backgroundColor: getPriorityColor(item.priority) },
                  ]}
                >
                  <MaterialIcons name="priority-high" size={24} color="#FFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.btnNewOccurrence}
            onPress={() => navigation.navigate("NewOccurrence")}
          >
            <Text style={styles.btnNewOccurrenceText}>Nova ocorrência</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Overlay de Filtros - Design Original */}
        {activeModal === "filter" && (
          <View style={styles.overlayPanel}>
            <View style={styles.overlayHeader}>
              <Ionicons name="filter" size={24} color="#FFF" />
              <Text style={styles.overlayTitle}>Filtros aplicados:</Text>
            </View>
            <View style={styles.overlayBody}>
              {/* Filtros que já estão aplicados */}
              <TouchableOpacity 
                style={styles.filterInput}
                onPress={handleTypeFilter}
              >
                <View style={styles.circleIcon}>
                  <Ionicons name="chevron-down" size={16} color="#999" />
                </View>
                <Text style={styles.filterInputText}>Tipo: {filters.type}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.filterInput}
                onPress={handleRegionFilter}
              >
                <View style={styles.circleIcon}>
                  <Ionicons name="chevron-down" size={16} color="#999" />
                </View>
                <Text style={styles.filterInputText}>Região: {filters.region}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.filterInput}
                onPress={handleStatusFilter}
              >
                <View style={styles.circleIcon}>
                  <Ionicons name="chevron-down" size={16} color="#999" />
                </View>
                <Text style={styles.filterInputText}>Status: {filters.status}</Text>
              </TouchableOpacity>

              {/* Opções adicionais para filtrar */}
              <Text style={styles.overlaySubtitle}>Mais opções:</Text>
              
              <View style={styles.moreOptionsRow}>
                <TouchableOpacity 
                  style={styles.moreOptionButton}
                  onPress={handlePriorityFilter}
                >
                  <Text style={styles.moreOptionText}>
                    Prioridade: {getPriorityLabel(filters.priority)}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.moreOptionButton}
                  onPress={() => {
                    Alert.alert("Período", "Funcionalidade em desenvolvimento");
                  }}
                >
                  <Text style={styles.moreOptionText}>Período</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.moreOptionsRow}>
                <TouchableOpacity 
                  style={styles.moreOptionButton}
                  onPress={handleTypeFilter}
                >
                  <Text style={styles.moreOptionText}>Tipo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.moreOptionButton}
                  onPress={handleRegionFilter}
                >
                  <Text style={styles.moreOptionText}>Região</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.moreOptionButton}
                  onPress={handleStatusFilter}
                >
                  <Text style={styles.moreOptionText}>Status</Text>
                </TouchableOpacity>
              </View>

              {/* Botão para limpar todos os filtros */}
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearAllText}>Limpar todos os filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Overlay de Pesquisa - Design Original */}
        {activeModal === "search" && (
          <View style={[styles.overlayPanel, { height: "auto", paddingBottom: 30 }]}>
            <View style={styles.overlayHeader}>
              <Text style={styles.overlayTitle}>Pesquisar:</Text>
            </View>
            <TextInput
              style={styles.searchInputWhite}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Digite para pesquisar..."
              placeholderTextColor="#999"
              autoFocus
            />
            {searchText.length > 0 && (
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchText("")}
              >
                <Text style={styles.clearSearchText}>Limpar pesquisa</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <CustomFooter navigation={navigation} activeRoute="Ocorrencias" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { paddingBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  priorityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  priorityCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  priorityNumber: { fontSize: 32, fontWeight: "bold", color: "#FFF" },
  priorityLabel: { fontSize: 16, fontWeight: "bold", color: "#FFF" },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: "48%",
    elevation: 2,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: "48%",
    elevation: 2,
  },
  activeButton: { borderWidth: 1, borderColor: "#001F3F" },
  filterText: { marginLeft: 8, fontSize: 15, color: "#333" },
  listContainer: { paddingHorizontal: 20, marginBottom: 20 },
  cardItem: {
    backgroundColor: "#C4C4C4",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  cardContentLeft: { flex: 1 },
  cardTypeText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  cardDetailText: { fontSize: 13, color: "#000", marginBottom: 1 },
  cardStatusText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    marginTop: 2,
  },
  cardIconBox: {
    width: 35,
    height: 35,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  btnNewOccurrence: {
    backgroundColor: "#C8102E",
    marginHorizontal: 40,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
  },
  btnNewOccurrenceText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  overlayPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#001F3F",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  overlayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  overlayTitle: {
    color: "#FFF",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "500",
  },
  overlaySubtitle: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "500",
  },
  overlayBody: { gap: 10 },
  filterInput: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  circleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  filterInputText: { fontSize: 16, color: "#000", flex: 1 },
  searchInputWhite: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000",
  },
  clearSearchButton: {
    alignSelf: "center",
    marginTop: 15,
    padding: 10,
  },
  clearSearchText: {
    color: "#FFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  moreOptionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  moreOptionButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  moreOptionText: {
    color: "#FFF",
    fontSize: 14,
  },
  clearAllButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  clearAllText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});