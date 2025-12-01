import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componentes
import CustomHeader from '../components/CustomHeader';
import CustomFooter from '../components/CustomFooter';

export default function AboutScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
      
      <CustomHeader 
        title="Sobre" 
        isHome={false} 
        navigation={navigation} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Cartão Azul Escuro */}
        <View style={styles.infoCard}>
          <View style={styles.cardContent}>
            
            {/* Ícone de Informação */}
            <Ionicons name="information-circle" size={32} color="#FFF" style={styles.icon} />
            
            {/* Textos */}
            <View>
              <Text style={styles.cardTitle}>Versão do aplicativo</Text>
              <Text style={styles.cardSubtitle}>Versão 1.0.0</Text>
            </View>

          </View>
        </View>

      </ScrollView>

      {/* Footer mantendo a aba Usuário ativa pois veio do Menu */}
      <CustomFooter navigation={navigation} activeRoute="Usuario" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  content: { 
    padding: 20 
  },
  
  // Estilo do Cartão
  infoCard: {
    backgroundColor: '#001F3F', // Azul Escuro
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    // Sombra
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#E0E0E0', // Branco levemente acinzentado para subtítulo
  },
});