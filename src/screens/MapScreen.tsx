import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import CustomHeader from "../components/CustomHeader";
import CustomFooter from "../components/CustomFooter";

export default function MapScreen({ navigation, route }: any) {
  const [searchText, setSearchText] = useState("");
  const [searchedLocation, setSearchedLocation] = useState<any>(null);
  const mapRef = useRef<MapView>(null);

  const initialCoords = route.params?.initialCoords;

  const defaultRegion = {
    latitude: -8.0089,
    longitude: -34.8553,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const [region, setRegion] = useState<Region>(
    initialCoords
      ? {
          latitude: initialCoords.lat,
          longitude: initialCoords.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      : defaultRegion
  );

  useEffect(() => {
    if (initialCoords && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: initialCoords.lat,
            longitude: initialCoords.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );
        setSearchedLocation({
          latitude: initialCoords.lat,
          longitude: initialCoords.lng,
          title: "Local da Ocorrência",
        });
      }, 500);
    }
  }, [initialCoords]);

  // Solicitar permissão ao abrir a tela (Boa prática)
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão de localização negada");
      }
    })();
  }, []);

  const markers = [
    {
      id: 1,
      lat: -8.005,
      lng: -34.85,
      color: "red",
      title: "Incêndio - Rua X",
    },
    {
      id: 2,
      lat: -8.012,
      lng: -34.86,
      color: "yellow",
      title: "Resgate - Av Y",
    },
    {
      id: 3,
      lat: -8.001,
      lng: -34.845,
      color: "turquoise",
      title: "Vistoria - Loja Z",
    },
    {
      id: 4,
      lat: -8.02,
      lng: -34.87,
      color: "red",
      title: "Acidente - BR 101",
    },
  ];

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    // 1. Fecha o teclado para melhor UX
    Keyboard.dismiss();

    try {
      // 2. Garante a permissão antes de buscar
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos da sua localização para ativar o mapa."
        );
        return;
      }

      console.log("Buscando por:", searchText); // Debug

      // 3. Tenta buscar o endereço
      let geocode = await Location.geocodeAsync(searchText);

      console.log("Resultado da busca:", geocode); // Debug

      if (geocode.length > 0) {
        const { latitude, longitude } = geocode[0];

        const newRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        mapRef.current?.animateToRegion(newRegion, 1000);
        setSearchedLocation({ latitude, longitude, title: searchText });
      } else {
        Alert.alert(
          "Não encontrado",
          "Endereço não localizado. Tente incluir a cidade (Ex: Rua Sol, Olinda)"
        );
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      Alert.alert(
        "Erro",
        "O serviço de geocodificação falhou. Verifique sua internet."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
      <CustomHeader
        title="Mapa de Ocorrências"
        isHome={false}
        navigation={navigation}
      />
      <View style={styles.content}>
        <MapView ref={mapRef} style={styles.map} initialRegion={region}>
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.lat, longitude: marker.lng }}
              title={marker.title}
              pinColor={marker.color}
            />
          ))}
          {searchedLocation && (
            <Marker
              coordinate={searchedLocation}
              title={searchedLocation.title}
              pinColor="purple"
            />
          )}
        </MapView>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons
              name="search"
              size={24}
              color="#000"
              style={styles.searchIcon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar endereço (Ex: Olinda)"
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText("");
                setSearchedLocation(null);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <CustomFooter navigation={navigation} activeRoute="" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { flex: 1, position: "relative" },
  map: { width: Dimensions.get("window").width, height: "100%" },
  searchContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FFF",
    borderRadius: 30,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#000" },
});
