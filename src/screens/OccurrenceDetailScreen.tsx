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
  Linking,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function OccurrenceDetailScreen({ navigation, route }: any) {
  const { occurrence } = route.params || {};

  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [signature, setSignature] = useState<string | null>(null);

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



  const handleOpenMap = () => {
    if (data.lat && data.lng) {
      const scheme = Platform.select({
        ios: "maps:0,0?q=",
        android: "geo:0,0?q=",
      });
      const latLng = `${data.lat},${data.lng}`;
      const label = `Ocorrência ${data.protocolo}`;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      if (url) {
        Linking.openURL(url).catch((err) => {
          console.error("Erro ao abrir mapa:", err);
          Alert.alert(
            "Erro",
            "Não foi possível abrir o aplicativo de mapas"
          );
        });
      }
    } else {
      Alert.alert(
        "Atenção",
        "Esta ocorrência não possui localização registrada."
      );
    }
  };

  const handleAddImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para adicionar imagens.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newAttachment = {
          id: Date.now().toString(),
          type: 'image',
          uri: result.assets[0].uri,
          name: `imagem_${Date.now()}.jpg`,
          date: new Date().toLocaleString(),
        };

        setAttachments([...attachments, newAttachment]);
        Alert.alert("Sucesso", "Imagem adicionada aos anexos!");
      }
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      Alert.alert("Erro", "Não foi possível adicionar a imagem");
    }
  };

  const handleAddDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const doc = result.assets[0];
        const newAttachment = {
          id: Date.now().toString(),
          type: 'document',
          uri: doc.uri,
          name: doc.name || `documento_${Date.now()}`,
          size: doc.size,
          date: new Date().toLocaleString(),
        };

        setAttachments([...attachments, newAttachment]);
        Alert.alert("Sucesso", "Documento adicionado aos anexos!");
      }
    } catch (error) {
      console.error("Erro ao adicionar documento:", error);
      Alert.alert("Erro", "Não foi possível adicionar o documento");
    }
  };

  const handleAddSignature = () => {
    Alert.alert(
      "Assinatura Digital",
      "Você será redirecionado para a tela de assinatura digital.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Continuar", 
          onPress: () => {
            navigation.navigate("SignatureScreen", {
              occurrenceId: data.protocolo,
              onSaveSignature: (signatureUri: string) => {
                setSignature(signatureUri);
                Alert.alert("Sucesso", "Assinatura digital salva!");
              }
            });
          }
        }
      ]
    );
  };

  const handleViewAttachment = (attachment: any) => {
    Alert.alert(
      `Anexo: ${attachment.name}`,
      `Tipo: ${attachment.type}\nData: ${attachment.date}\nTamanho: ${attachment.size ? `${(attachment.size / 1024).toFixed(2)} KB` : 'N/A'}`,
      [
        { text: "Fechar", style: "cancel" },
        { 
          text: "Abrir", 
          onPress: () => {
            console.log("Abrir anexo:", attachment.uri);
          }
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            setAttachments(attachments.filter(a => a.id !== attachment.id));
          }
        }
      ]
    );
  };

  const handleOpenTimeline = () => {
    setShowTimelineModal(true);
  };

  const handleDownload = async () => {
    try {
      Alert.alert(
        "Download",
        "Selecione o formato para download:",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "PDF", 
            onPress: async () => {
              Alert.alert("Download PDF", `Gerando PDF do protocolo ${data.protocolo}...`);
             
            }
          },
          { 
            text: "ZIP (com anexos)", 
            onPress: async () => {
              if (attachments.length === 0) {
                Alert.alert("Aviso", "Não há anexos para incluir no download.");
                return;
              }
              
              Alert.alert("Download ZIP", "Preparando pacote com anexos...");
            }
          }
        ]
      );
    } catch (error) {
      console.error("Erro no download:", error);
      Alert.alert("Erro", "Não foi possível realizar o download");
    }
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
            {/* Thumbnails dos anexos existentes */}
            {attachments.slice(0, 3).map((attachment, index) => (
              <TouchableOpacity
                key={attachment.id}
                style={styles.attachmentThumb}
                onPress={() => handleViewAttachment(attachment)}
              >
                <Ionicons 
                  name={attachment.type === 'image' ? "image" : "document"} 
                  size={30} 
                  color="#FFF" 
                />
              </TouchableOpacity>
            ))}
            
            {/* Botão para adicionar novos anexos */}
            <TouchableOpacity
              style={[styles.attachmentThumb, { backgroundColor: "#FFF" }]}
              onPress={() => setShowAttachmentsModal(true)}
            >
              <Ionicons name="add" size={40} color="#000" />
            </TouchableOpacity>
          </View>
          
          {/* Contador de anexos */}
          {attachments.length > 0 && (
            <Text style={styles.attachmentCount}>
              {attachments.length} anexo(s) adicionado(s)
            </Text>
          )}
        </View>

        <View style={styles.actionButtonsRow}>
          {/* LOCALIZAÇÃO */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleOpenMap}>
            <Ionicons name="map" size={32} color="#000" />
            <Text style={styles.actionBtnText}>Localização</Text>
          </TouchableOpacity>
          
          {/* ANEXOS */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowAttachmentsModal(true)}
          >
            <Feather name="paperclip" size={32} color="#000" />
            <Text style={styles.actionBtnText}>Anexos</Text>
          </TouchableOpacity>
          
          {/* TIMELINE */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleOpenTimeline}
          >
            <MaterialIcons name="timeline" size={32} color="#000" />
            <Text style={styles.actionBtnText}>Timeline</Text>
          </TouchableOpacity>
          
          {/* DOWNLOAD */}
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
            <ScrollView style={styles.timelineScroll}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineText}>
                    <Text style={{ fontWeight: "bold" }}>Criação:</Text> {data.date}
                  </Text>
                  <Text style={styles.timelineSubtext}>
                    Adicionado por: {data.responsavel}
                  </Text>
                </View>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineText}>
                    <Text style={{ fontWeight: "bold" }}>Status Atual:</Text> {data.status}
                  </Text>
                  <Text style={styles.timelineSubtext}>
                    Última atualização: {data.date}
                  </Text>
                </View>
              </View>
              
              {/* Adicione mais eventos da timeline aqui */}
            </ScrollView>
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
              <Text style={styles.modalTitle}>Anexos</Text>
            </View>
            
            <ScrollView style={styles.attachmentsList}>
              {/* Lista de anexos existentes */}
              {attachments.map((attachment) => (
                <TouchableOpacity 
                  key={attachment.id}
                  style={styles.attachmentListItem}
                  onPress={() => handleViewAttachment(attachment)}
                >
                  <View style={styles.attachmentListItemContent}>
                    <Ionicons 
                      name={attachment.type === 'image' ? "image-outline" : "document-outline"} 
                      size={24} 
                      color="#FFF" 
                    />
                    <View style={styles.attachmentInfo}>
                      <Text style={styles.attachmentListText}>{attachment.name}</Text>
                      <Text style={styles.attachmentListSubtext}>
                        {attachment.date} • {attachment.type}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" />
                </TouchableOpacity>
              ))}
              
              {/* Opções para adicionar novos anexos */}
              <Text style={styles.addAttachmentTitle}>Adicionar Novo:</Text>
              
              <TouchableOpacity 
                style={styles.addAttachmentButton}
                onPress={handleAddImage}
              >
                <Ionicons name="image-outline" size={24} color="#FFF" />
                <Text style={styles.addAttachmentText}>Imagem</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addAttachmentButton}
                onPress={handleAddDocument}
              >
                <Ionicons name="document-outline" size={24} color="#FFF" />
                <Text style={styles.addAttachmentText}>Documento</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addAttachmentButton}
                onPress={handleAddSignature}
              >
                <Ionicons name="create-outline" size={24} color="#FFF" />
                <Text style={styles.addAttachmentText}>Assinatura digital</Text>
              </TouchableOpacity>
            </ScrollView>
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
  attachmentCount: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
    opacity: 0.8,
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
    maxHeight: "80%",
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
  timelineScroll: {
    maxHeight: 300,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFF",
    marginRight: 15,
    marginTop: 5,
  },
  timelineContent: {
    flex: 1,
  },
  timelineText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 2,
  },
  timelineSubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  attachmentsList: {
    maxHeight: 400,
  },
  attachmentListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  attachmentListItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  attachmentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  attachmentListText: {
    color: "#FFF",
    fontSize: 16,
  },
  attachmentListSubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 2,
  },
  addAttachmentTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  addAttachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  addAttachmentText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 12,
  },
});