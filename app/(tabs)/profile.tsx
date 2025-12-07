import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

type UserToken = {
  _id: string;
  rol: string;
  nombres: string;
  apellidos: string;
  email: string;
  iat?: number;
  exp?: number;
};

export default function Profile() {
  const [user, setUser] = useState<UserToken | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return; // No hay sesión

        const decoded: UserToken = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Error obteniendo usuario de token:", error);
        Alert.alert("Error", "No se pudo cargar la información del usuario");
      }
    };

    loadUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={28} color="#22c55e" />
        </TouchableOpacity>
      </View>

      {/* TARJETA DE PERFIL */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }}
          style={styles.avatar}
        />

        <Text style={styles.name}>
          {user ? `${user.nombres} ${user.apellidos}` : "Cargando..."}
        </Text>
        <Text style={styles.email}>{user ? user.email : ""}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Direcciones</Text>
          </View>
        </View>

        {/* BOTONES */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={async () => {
              await AsyncStorage.removeItem("token");
              Alert.alert("Sesión cerrada");
            }}
          >
            <Text style={styles.buttonSecondaryText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ... estilos igual que tu código anterior


const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: "#0f172a",
paddingHorizontal: 20,
},

header: {
marginTop: 40,
marginBottom: 20,
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
},

headerTitle: {
color: "#ffffff",
fontSize: 28,
fontWeight: "bold",
},

settingsBtn: {
padding: 5,
},

profileCard: {
backgroundColor: "#1f2937",
borderRadius: 20,
padding: 25,
alignItems: "center",
shadowColor: "#22c55e",
shadowOpacity: 0.25,
shadowRadius: 10,
shadowOffset: { width: 0, height: 4 },
},

avatar: {
width: 120,
height: 120,
borderRadius: 100,
marginBottom: 15,
borderWidth: 2,
borderColor: "#22c55e",
},

name: {
color: "#ffffff",
fontSize: 22,
fontWeight: "bold",
},

email: {
color: "#cbd5e1",
fontSize: 14,
marginBottom: 20,
},

statsContainer: {
flexDirection: "row",
justifyContent: "space-between",
width: "100%",
marginBottom: 25,
},

statBox: {
alignItems: "center",
flex: 1,
},

statNumber: {
fontSize: 20,
fontWeight: "bold",
color: "#22c55e",
},

statLabel: {
color: "#cbd5e1",
fontSize: 12,
marginTop: 4,
},

buttonsContainer: {
width: "100%",
},

button: {
backgroundColor: "#22c55e",
paddingVertical: 14,
borderRadius: 12,
marginBottom: 15,
},

buttonText: {
color: "#0f172a",
textAlign: "center",
fontWeight: "bold",
fontSize: 16,
},

buttonSecondary: {
borderWidth: 1,
borderColor: "#22c55e",
paddingVertical: 14,
borderRadius: 12,
},

buttonSecondaryText: {
color: "#22c55e",
textAlign: "center",
fontWeight: "bold",
fontSize: 16,
},
});
