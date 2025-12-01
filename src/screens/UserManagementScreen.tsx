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
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

// Componentes
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function UserManagementScreen({ navigation }: any) {
  // Dados Mockados (Simulando o Banco de Dados)
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Sgt. Peixoto",
      cpf: "123.456.789-00",
      perfil: "Administrador",
    },
    {
      id: "2",
      name: "Cb. Silva",
      cpf: "987.654.321-11",
      perfil: "Operacional",
    },
    {
      id: "3",
      name: "Sd. Oliveira",
      cpf: "456.789.123-22",
      perfil: "Operacional",
    },
    {
      id: "4",
      name: "Maj. Roberto",
      cpf: "321.654.987-33",
      perfil: "Comandante",
    },
  ]);

  // Função de Excluir
  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o usuário ${name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            // Remove o usuário da lista visualmente
            setUsers(users.filter((user) => user.id !== id));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />

      <CustomHeader
        title="Gestão de Usuários - SisBMPE"
        isHome={false}
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* LISTA DE USUÁRIOS */}
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            {/* Avatar (Círculo Branco) */}
            <View style={styles.avatarContainer}>
              {/* Se tiver foto real, usa Image. Aqui usamos View branca vazia conforme imagem */}
            </View>

            {/* Informações do Usuário */}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDetail}>CPF</Text>
              <Text style={styles.userDetail}>{user.cpf}</Text>
              <Text style={styles.userDetail}>Perfil: {user.perfil}</Text>
            </View>

            {/* Botões de Ação (Direita) */}
            <View style={styles.actionsContainer}>
              
              {/* Botão Editar (Amarelo) */}
              <TouchableOpacity
                style={styles.editButton}
                // AQUI A MUDANÇA: Enviamos o objeto 'user' e a flag 'isEditing'
                onPress={() =>
                  navigation.navigate("NewUser", {
                    user: user,
                    isEditing: true,
                  })
                }
              >
                <MaterialIcons name="edit" size={16} color="#000" />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>

              {/* Botão Excluir (Vermelho) */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(user.id, user.name)}
              >
                <FontAwesome5 name="trash-alt" size={14} color="#FFF" />
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* BOTÃO NOVO USUÁRIO */}
        <TouchableOpacity
          style={styles.btnNewUser}
          onPress={() => navigation.navigate("NewUser")} // <--- CONECTE AQUI
        >
          <Text style={styles.btnNewUserText}>Novo usuário</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Ativo na aba Usuário */}
      <CustomFooter navigation={navigation} activeRoute="Usuario" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // CARD DE USUÁRIO
  userCard: {
    backgroundColor: "#E0E0E0", // Cinza claro do fundo do card
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  // Avatar
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Redondo
    backgroundColor: "#FFF", // Branco
    marginRight: 15,
  },

  // Infos
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 12,
    color: "#333",
    marginBottom: 1,
  },

  // Botões Laterais
  actionsContainer: {
    flexDirection: "column", // Um em cima do outro
    gap: 10,
  },

  // Estilo Botão Editar
  editButton: {
    backgroundColor: "#FFCC00", // Amarelo
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: 80,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 5,
  },

  // Estilo Botão Excluir
  deleteButton: {
    backgroundColor: "#C8102E", // Vermelho
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: 80,
    elevation: 2,
  },
  deleteButtonText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 5,
  },

  // Botão Grande Novo Usuário
  btnNewUser: {
    backgroundColor: "#C8102E",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 40, // Para ficar centralizado e menor que a largura total
    elevation: 5,
  },
  btnNewUserText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
