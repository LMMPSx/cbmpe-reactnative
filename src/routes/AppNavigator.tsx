import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// --- IMPORTANDO TODAS AS TELAS ---
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import NewOccurrenceScreen from "../screens/NewOccurrenceScreen";
import OccurrenceListScreen from "../screens/OccurrenceListScreen";
import OccurrenceDetailScreen from "../screens/OccurrenceDetailScreen";
import MapScreen from "../screens/MapScreen";
import ReportsScreen from "../screens/ReportsScreen";
import UserManagementScreen from "../screens/UserManagementScreen";
import MenuScreen from "../screens/MenuScreen";

// NOVAS TELAS DO MENU (O erro estava aqui, faltava importar e registrar estas)
import SettingsScreen from "../screens/SettingsScreen";
import VirtualAssistantScreen from "../screens/VirtualAssistantScreen";
import AuditLogsScreen from "../screens/AuditLogsScreen";
import AboutScreen from "../screens/AboutSreen";
import NewUserScreen from "../screens/NewUserScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Fluxo de Autenticação */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: "Recuperar Senha", headerTintColor: "#000" }}
        />

        {/* Fluxo Principal */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Ocorrências */}
        <Stack.Screen
          name="NewOccurrence"
          component={NewOccurrenceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OccurrenceList"
          component={OccurrenceListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OccurrenceDetail"
          component={OccurrenceDetailScreen}
          options={{ headerShown: false }}
        />

        {/* Funcionalidades Extras */}
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Reports"
          component={ReportsScreen}
          options={{ headerShown: false }}
        />

        {/* Menu e Gestão */}
        <Stack.Screen
          name="MenuScreen"
          component={MenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserManagement"
          component={UserManagementScreen}
          options={{ headerShown: false }}
        />

        
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VirtualAssistant"
          component={VirtualAssistantScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AuditLogs"
          component={AuditLogsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewUser"
          component={NewUserScreen}
          options={{ headerShown: false }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
