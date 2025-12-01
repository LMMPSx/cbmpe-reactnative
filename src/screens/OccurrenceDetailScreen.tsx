import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function OccurrenceDetailScreen({ navigation, route }: any) {
  const { occurrence } = route.params || {};

  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);

  // Fallback de dados para evitar erros se vier vazio
  const data = occurrence || {
    type: "Desconhecido",
    protocolo: "---",
    description: "Sem descrição.",
    date: "--/--",
    responsavel: "---",
    status: "---",
    priority: "---",
    lat: 0,
    lng: 0,
  };

  const getPriorityLabel = (p: string) => {
    if (p === "high") return "Alta";
    if (p === "medium") return "Média";
    if (p === "low") return "Baixa";
    return p;
  };

  // Funções de Ação
  const handleOpenMap = () => {
    if (data.lat && data.lng) {
      navigation.navigate("MapScreen", {
        initialCoords: { lat: data.lat, lng: data.lng },
      });
    } else {
      Alert.alert(
        "Atenção",
        "Esta ocorrência não possui localização registrada."
      );
    }
  };
  const handleDownload = () => {
    Alert.alert("Download", `Gerando PDF do protocolo ${data.protocolo}...`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
      <CustomHeader
        title="Detalhamento da ocorrência"
        isHome={false}
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{data.type}</Text>

            {/* BOTÃO EDITAR CONECTADO */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("NewOccurrence", {
                  occurrence: data,
                  isEditing: true,
                })
              }
            >
              <MaterialIcons name="edit" size={20} color="#FFF" />
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.infoBox,
              { height: "auto", minHeight: 80, paddingVertical: 10 },
            ]}
          >
            <Text style={styles.label}>Nº protocolo: {data.protocolo}</Text>
            <Text style={styles.value}>Descrição: {data.description}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.value}>Data/Hora: {data.date}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.value}>Responsável: {data.responsavel}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.value}>
              Status: <Text style={{ fontWeight: "bold" }}>{data.status}</Text>
            </Text>
          </View>
          <View style={styles.priorityBox}>
            <Text style={styles.priorityText}>
              Prioridade:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {getPriorityLabel(data.priority)}
              </Text>
            </Text>
          </View>

          <Text style={styles.attachmentsLabel}>Anexos</Text>
          <View style={styles.attachmentsRow}>
            <View style={styles.attachmentThumb}>
              <Ionicons name="image" size={30} color="#FFF" />
            </View>
            <View style={styles.attachmentThumb}>
              <Ionicons name="image" size={30} color="#FFF" />
            </View>
            <View style={styles.attachmentThumb}>
              <Ionicons name="image" size={30} color="#FFF" />
            </View>
            <TouchableOpacity
              style={[styles.attachmentThumb, { backgroundColor: "#FFF" }]}
              onPress={() => setShowAttachmentsModal(true)}
            >
              <Ionicons name="add" size={40} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleOpenMap}>
            <Ionicons name="map" size={32} color="#000" />
            <Text style={styles.actionBtnText}>Localização</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowAttachmentsModal(true)}
          >
            <Feather name="paperclip" size={32} color="#000" />
            <Text style={styles.actionBtnText}>Anexos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowTimelineModal(true)}
          >
            <MaterialIcons name="timeline" size={32} color="#000" />
            <Text style={styles.actionBtnText}>Timeline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
            <Feather name="download" size={32} color="#000" />
            <Text style={styles.actionBtnText}>Download</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomFooter navigation={navigation} activeRoute="Ocorrencias" />

      {/* MODAL TIMELINE */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTimelineModal}
        onRequestClose={() => setShowTimelineModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimelineModal(false)}
        >
          <View style={styles.modalPanel}>
            <View style={styles.modalHeaderRow}>
              <MaterialIcons name="timeline" size={28} color="#FFF" />
              <Text style={styles.modalTitle}>Timeline</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineText}>
                Adicionado por: {data.responsavel}
              </Text>
              <Text style={styles.timelineText}>Data/Hora: {data.date}</Text>
              <Text style={styles.timelineText}>Editado por: -</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL ANEXOS */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAttachmentsModal}
        onRequestClose={() => setShowAttachmentsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAttachmentsModal(false)}
        >
          <View style={styles.modalPanel}>
            <View style={styles.modalHeaderRow}>
              <Feather name="paperclip" size={28} color="#FFF" />
              <Text style={styles.modalTitle}>Anexos:</Text>
            </View>
            <View style={styles.attachmentsList}>
              <TouchableOpacity style={styles.attachmentListItem}>
                <Text style={styles.attachmentListText}>Imagem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentListItem}>
                <Text style={styles.attachmentListText}>Documento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentListItem}>
                <Text style={styles.attachmentListText}>Vídeo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentListItem}>
                <Text style={styles.attachmentListText}>
                  Assinatura digital
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  mainCard: {
    backgroundColor: "#001F3F",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 15,
    position: "relative",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    width: "80%",
  },
  editButton: { position: "absolute", right: 0, top: 0, alignItems: "center" },
  editText: { color: "#FFF", fontSize: 10 },
  infoBox: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  label: { fontSize: 14, color: "#333", marginBottom: 2 },
  value: { fontSize: 16, color: "#000" },
  priorityBox: {
    backgroundColor: "#C8102E",
    borderRadius: 10,
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  priorityText: { color: "#FFF", fontSize: 18 },
  attachmentsLabel: {
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  attachmentsRow: { flexDirection: "row", justifyContent: "space-between" },
  attachmentThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  actionBtnText: {
    fontSize: 10,
    color: "#000",
    marginTop: 5,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalPanel: {
    backgroundColor: "#001F3F",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 40,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  timelineContent: { gap: 10 },
  timelineText: { color: "#FFF", fontSize: 18 },
  attachmentsList: { gap: 15 },
  attachmentListItem: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    paddingBottom: 10,
  },
  attachmentListText: { color: "#FFF", fontSize: 18 },
});
