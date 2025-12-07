import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "@/constants/api";

export default function LoginMueblix() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(40));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function handleChange(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  async function handleLogin() {
    try {
      const response = await fetch(`${API_URL}/usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      // Primero revisamos si es un status ok
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Respuesta no JSON:", text);
        Alert.alert("Error", "Respuesta inesperada del servidor");
        return;
      }

      if (!response.ok) {
        // Mostrar mensaje de error del servidor
        Alert.alert("Error", data.message || "No se pudo iniciar sesión");
        return;
      }

      // Guardar token en AsyncStorage
      await AsyncStorage.setItem("token", data.token);
      Alert.alert("Éxito", "Inicio de sesión correcto");

      // Redirigir a inicio o dashboard
      router.push("/");

    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  }

  return (
    <ScrollView style={styles.safeArea} contentContainerStyle={styles.centerContent}>
      <Animated.View
        style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.brand}>Mueblix</Text>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Ingresa tus datos para continuar</Text>

        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.registerBtn]} onPress={() => router.push("/register")}>
          <Text style={[styles.btnText, styles.registerBtnText]}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.backBtn]} onPress={() => router.push("/")}>
          <Text style={[styles.btnText, styles.backBtnText]}>Volver al inicio</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0f172a" },
  centerContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 40, paddingHorizontal: 20 },
  card: { backgroundColor: "#1e293b", borderRadius: 30, padding: 28, shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 25, elevation: 10, alignItems: "center" },
  brand: { fontSize: 34, fontWeight: "900", color: "#22c55e", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", color: "#e2e8f0" },
  subtitle: { marginTop: 4, color: "#94a3b8", fontSize: 14, marginBottom: 30 },
  formGroup: { width: "100%", gap: 16 },
  input: { backgroundColor: "#0f172a", padding: 14, borderRadius: 14, fontSize: 15, color: "white", borderWidth: 1, borderColor: "#334155" },
  btn: { marginTop: 26, backgroundColor: "#22c55e", paddingVertical: 16, width: "100%", borderRadius: 18, shadowColor: "#22c55e", shadowOpacity: 0.4, shadowRadius: 10, elevation: 10 },
  btnText: { textAlign: "center", color: "#0f172a", fontSize: 17, fontWeight: "900" },
  registerBtn: { marginTop: 14, backgroundColor: "#334155" },
  registerBtnText: { color: "#cbd5e1" },
  backBtn: { marginTop: 14, backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#22c55e" },
  backBtnText: { color: "#22c55e" },
});
