import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
  // 1. IMPORTAR COMPONENTES NECESSÁRIOS
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import SignatureScreen from "react-native-signature-canvas";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";

import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function NewOccurrenceScreen({ navigation, route }: any) {
  // VERIFICA SE ESTÁ NO MODO EDIÇÃO
  const { occurrence, isEditing } = route.params || {};

  const [step, setStep] = useState(1);

  // PREENCHE O FORMULÁRIO SE FOR EDIÇÃO
  const [formData, setFormData] = useState({
    natureza: occurrence?.type || "",
    data: occurrence?.date || "",
    responsavel: occurrence?.responsavel || "", // É um TextInput
    descricao: occurrence?.description || "",
    localizacao: occurrence?.region || "",
    prioridade:
      occurrence?.priority === "high"
        ? "Alta"
        : occurrence?.priority === "medium"
        ? "Média"
        : occurrence?.priority === "low"
        ? "Baixa"
        : "",
    status: occurrence?.status || "",
    protocolo: occurrence?.protocolo || "", // É um TextInput
    signature: null as string | null,
    attachmentImage: null as string | null,
    attachmentDoc: null as any,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const signatureRef = useRef<any>(null);

  // A lista 'responsavel' foi removida do optionsMap para ser substituída por um TextInput.
  const optionsMap: any = {
    natureza: [
      "Incêndio",
      "Resgate",
      "Salvamento",
      "Vistoria Técnica",
      "Auxílio à Comunidade",
      "Outros",
    ],
    prioridade: ["Baixa", "Média", "Alta", "Crítica"],
    status: ["Aberto", "Em Andamento", "Pendente", "Finalizado"],
  };

  const openSelector = (field: string) => {
    setCurrentField(field);
    setModalVisible(true);
  };
  const handleSelect = (item: string) => {
    setFormData({ ...formData, [currentField]: item });
    setModalVisible(false);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    if (event.type === "set") {
      if (mode === "date") {
        setMode("time");
        setShowDatePicker(true);
      } else {
        setMode("date");
        const formattedDate =
          currentDate.toLocaleDateString("pt-BR") +
          " " +
          currentDate.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });
        setFormData({ ...formData, data: formattedDate });
      }
    }
  };
  const showDatepickerMode = () => {
    setMode("date");
    setShowDatePicker(true);
  };

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        setFormData({
          ...formData,
          localizacao: `${addr.street || ""}, ${addr.streetNumber || ""} - ${
            addr.district || ""
          }`,
        });
      } else {
        setFormData({
          ...formData,
          localizacao: `${location.coords.latitude}, ${location.coords.longitude}`,
        });
      }
    } catch (e) {
      Alert.alert("Erro no GPS");
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled)
      setFormData({ ...formData, attachmentImage: result.assets[0].uri });
  };
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled)
      setFormData({ ...formData, attachmentDoc: result.assets[0] });
  };
  const handleSignatureOK = (sig: string) => {
    setFormData({ ...formData, signature: sig });
    setSignatureModalVisible(false);
  };
  const handleNext = () => setStep(2);

  const handleSave = () => {
    if (!formData.protocolo) {
      Alert.alert("Erro", "Protocolo obrigatório");
      return;
    }

    // MENSAGEM DIFERENTE PARA EDIÇÃO
    const msg = isEditing
      ? "Ocorrência atualizada com sucesso!"
      : "Ocorrência criada com sucesso!";
    Alert.alert("Sucesso", msg, [
      { text: "OK", onPress: () => navigation.navigate("Home") },
    ]);
  };

  const renderOptionItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.modalItemText}>{item}</Text>
      {formData[currentField as keyof typeof formData] === item && (
        <Ionicons name="checkmark" size={20} color="#C8102E" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />

      {/* HEADER DINÂMICO */}
      <CustomHeader
        title={isEditing ? "Editar ocorrência" : "Nova ocorrência"}
        isHome={false}
        navigation={navigation}
      />

      {/* 2. ENVOLVER SCROLLVIEW COM KEYBOARDAVOIDINGVIEW */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        // Você pode ajustar o 'keyboardVerticalOffset' se o cabeçalho estiver muito grande
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} 
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.stepsContainer}>
            <View
              style={[
                styles.stepCircle,
                step === 1 ? styles.stepActive : styles.stepInactive,
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  step === 1 ? styles.stepTextActive : styles.stepTextInactive,
                ]}
              >
                1
              </Text>
            </View>
            <View
              style={[
                styles.stepCircle,
                step === 2 ? styles.stepActive : styles.stepInactive,
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  step === 2 ? styles.stepTextActive : styles.stepTextInactive,
                ]}
              >
                2
              </Text>
            </View>
          </View>

          {/* --- PASSO 1 --- */}
          {step === 1 && (
            <View style={styles.formSection}>
              <Text style={styles.label}>Natureza da ocorrência</Text>
              <TouchableOpacity
                style={styles.inputDropdown}
                onPress={() => openSelector("natureza")}
              >
                <Text
                  style={
                    formData.natureza ? styles.inputText : styles.placeholderText
                  }
                >
                  {formData.natureza || "Selecione..."}
                </Text>
                <Ionicons name="chevron-down" size={24} color="#999" />
              </TouchableOpacity>

              <Text style={styles.label}>Data/Hora*</Text>
              <TouchableOpacity
                style={styles.inputDropdown}
                onPress={showDatepickerMode}
              >
                <Text
                  style={
                    formData.data ? styles.inputText : styles.placeholderText
                  }
                >
                  {formData.data || "DD/MM/AAAA HH:MM"}
                </Text>
                <Ionicons name="calendar" size={20} color="#999" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDate}
                />
              )}

              <Text style={styles.label}>Responsável</Text>
              {/* CAMPO RESPONSÁVEL COMO TEXT INPUT */}
              <TextInput
                style={styles.input}
                value={formData.responsavel}
                onChangeText={(t) =>
                  setFormData({ ...formData, responsavel: t })
                }
                placeholder="Digite o nome do responsável"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline={true}
                numberOfLines={4}
                value={formData.descricao}
                onChangeText={(t) => setFormData({ ...formData, descricao: t })}
              />

              <Text style={styles.label}>Localização</Text>
              {/* ESTE CAMPO ESTARÁ VISÍVEL GRAÇAS AO KEYBOARDAVOIDINGVIEW */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { paddingRight: 40 }]}
                  value={formData.localizacao}
                  onChangeText={(t) =>
                    setFormData({ ...formData, localizacao: t })
                  }
                  placeholder="Endereço"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={styles.inputIconRight}
                  onPress={getCurrentLocation}
                >
                  {loadingLocation ? (
                    <ActivityIndicator size="small" color="#C8102E" />
                  ) : (
                    <Ionicons name="map" size={24} color="#C8102E" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAction} onPress={handleNext}>
                  <Text style={styles.btnActionText}>Próximo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* --- PASSO 2 --- */}
          {step === 2 && (
            <View style={styles.formSection}>
              <Text style={styles.label}>Anexos</Text>
              <View style={styles.attachmentsRow}>
                <TouchableOpacity
                  style={[
                    styles.attachmentBox,
                    formData.attachmentDoc && styles.attachmentBoxSelected,
                  ]}
                  onPress={pickDocument}
                >
                  {formData.attachmentDoc ? (
                    <Ionicons name="checkmark-circle" size={30} color="green" />
                  ) : (
                    <Feather name="paperclip" size={30} color="#999" />
                  )}
                  <Text style={styles.attachmentText}>
                    {formData.attachmentDoc ? "Doc OK" : "Arquivo"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.attachmentBox,
                    formData.attachmentImage && styles.attachmentBoxSelected,
                  ]}
                  onPress={pickImage}
                >
                  {formData.attachmentImage ? (
                    <Image
                      source={{ uri: formData.attachmentImage }}
                      style={styles.attachmentPreview}
                    />
                  ) : (
                    <Ionicons name="image-outline" size={30} color="#999" />
                  )}
                  {!formData.attachmentImage && (
                    <Text style={styles.attachmentText}>Galeria</Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Assinatura digital</Text>
              <TouchableOpacity
                style={[styles.input, styles.signatureArea]}
                onPress={() => setSignatureModalVisible(true)}
              >
                {formData.signature ? (
                  <Image
                    source={{ uri: formData.signature }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                  />
                ) : (
                  <Text style={{ color: "#999" }}>Toque para assinar</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.label}>Prioridade</Text>
              <TouchableOpacity
                style={styles.inputDropdown}
                onPress={() => openSelector("prioridade")}
              >
                <Text
                  style={
                    formData.prioridade
                      ? styles.inputText
                      : styles.placeholderText
                  }
                >
                  {formData.prioridade || "Selecione..."}
                </Text>
                <Ionicons name="chevron-down" size={24} color="#999" />
              </TouchableOpacity>

              <Text style={styles.label}>Status</Text>
              <TouchableOpacity
                style={styles.inputDropdown}
                onPress={() => openSelector("status")}
              >
                <Text
                  style={
                    formData.status ? styles.inputText : styles.placeholderText
                  }
                >
                  {formData.status || "Selecione..."}
                </Text>
                <Ionicons name="chevron-down" size={24} color="#999" />
              </TouchableOpacity>

              <Text style={styles.label}>Número do protocolo*</Text>
              {/* ESTE CAMPO ESTARÁ VISÍVEL GRAÇAS AO KEYBOARDAVOIDINGVIEW */}
              <TextInput
                style={styles.input}
                value={formData.protocolo}
                onChangeText={(t) =>
                  setFormData({ ...formData, protocolo: t })
                }
                keyboardType="numeric"
                placeholder="Digite o número do protocolo"
                placeholderTextColor="#999"
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.btnCancelText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAction} onPress={handleSave}>
                  <Text style={styles.btnActionText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* FIM DO KEYBOARDAVOIDINGVIEW */}

      <CustomFooter navigation={navigation} activeRoute="Ocorrencias" />

      {/* MODAIS (SELEÇÃO E ASSINATURA) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione uma opção</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={optionsMap[currentField] || []}
              keyExtractor={(item) => item}
              renderItem={renderOptionItem}
              style={{ maxHeight: 300 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={signatureModalVisible}
        animationType="slide"
        onRequestClose={() => setSignatureModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View
            style={{
              height: 60,
              backgroundColor: "#001F3F",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>
              Assinar na tela
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <SignatureScreen
              ref={signatureRef}
              onOK={handleSignatureOK}
              descriptionText="Assine acima"
              clearText="Limpar"
              confirmText="Confirmar"
              webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`}
            />
          </View>
          <View style={styles.signatureButtons}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => setSignatureModalVisible(false)}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => signatureRef.current.clearSignature()}
            >
              <Text style={styles.btnCancelText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAction}
              onPress={() => signatureRef.current.readSignature()}
            >
              <Text style={styles.btnActionText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { paddingBottom: 20 },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
    gap: 10,
  },
  stepCircle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  stepActive: { backgroundColor: "#333" },
  stepInactive: { backgroundColor: "#FFF" },
  stepText: { fontSize: 14, fontWeight: "bold" },
  stepTextActive: { color: "#FFF" },
  stepTextInactive: { color: "#333" },
  formSection: { paddingHorizontal: 20 },
  label: { fontSize: 16, color: "#000", marginBottom: 8, marginTop: 10 },
  input: {
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  inputDropdown: {
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholderText: { color: "#999" },
  inputText: { color: "#000" },
  inputWrapper: { position: "relative", justifyContent: "center" },
  inputIconRight: { position: "absolute", right: 15 },
  textArea: { height: 120, textAlignVertical: "top", paddingTop: 15 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
    gap: 15,
  },
  btnCancel: {
    flex: 1,
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    elevation: 2,
  },
  btnAction: {
    flex: 1,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#C8102E",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  btnCancelText: { color: "#888", fontSize: 18, fontWeight: "bold" },
  btnActionText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#001F3F" },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalItemText: { fontSize: 16, color: "#333" },
  attachmentsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  attachmentBox: {
    flex: 1,
    backgroundColor: "#EAEAEA",
    height: 80,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  attachmentBoxSelected: {
    borderWidth: 2,
    borderColor: "#C8102E",
    backgroundColor: "#FFF",
  },
  attachmentText: { fontSize: 12, color: "#666", marginTop: 5 },
  attachmentPreview: { width: "100%", height: "100%", borderRadius: 8 },
  signatureArea: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  signatureButtons: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#FFF",
  },
});