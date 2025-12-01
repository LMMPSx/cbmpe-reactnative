import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function VirtualAssistantScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
      <CustomHeader title="Assistente virtual" navigation={navigation} />

      <View style={styles.chatContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Mensagem Bot */}
          <View style={styles.botRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={24} color="#666" />
            </View>
            <View style={styles.botBubble}>
              <Text style={styles.chatText}>Como posso ajudar?</Text>
            </View>
          </View>

          {/* Mensagem Usuário */}
          <View style={styles.userRow}>
            <View style={styles.userBubble}>
              <Text style={styles.chatText}>
                Gostaria de registrar uma ocorrência.
              </Text>
            </View>
            <View style={[styles.avatarCircle, { backgroundColor: "#DDD" }]} />
          </View>

          {/* Mensagem Bot */}
          <View style={styles.botRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={24} color="#666" />
            </View>
            <View style={styles.botBubble}>
              <Text style={styles.chatText}>
                Certo! Qual o tipo da ocorrência?
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botões de Resposta Rápida */}
        <View style={styles.quickReplies}>
          <TouchableOpacity
            style={[styles.replyBtn, { backgroundColor: "#C8102E" }]}
          >
            <Text style={styles.replyText}>Incêndio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.replyBtn, { backgroundColor: "#FFCC00" }]}
          >
            <Text style={[styles.replyText, { color: "#000" }]}>Resgate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.replyBtn, { backgroundColor: "#87CEEB" }]}
          >
            <Text style={[styles.replyText, { color: "#000" }]}>
              Treinamento
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input de Texto */}
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="keyboard"
              size={24}
              color="#666"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Digite aqui..."
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      <CustomFooter navigation={navigation} activeRoute="Usuario" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  chatContainer: { flex: 1, justifyContent: "space-between" },
  scrollContent: { padding: 20 },

  // Chat Rows
  botRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 20 },
  userRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 20,
  },

  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 10,
  },

  botBubble: {
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    padding: 15,
    maxWidth: "75%",
  },
  userBubble: {
    backgroundColor: "#87CEEB",
    borderRadius: 15,
    borderBottomRightRadius: 0,
    padding: 15,
    maxWidth: "75%",
  },
  chatText: { fontSize: 16, color: "#000" },

  // Quick Replies
  quickReplies: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  replyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  replyText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },

  // Input
  inputArea: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  textInput: { flex: 1, fontSize: 16, color: "#333" },
});
