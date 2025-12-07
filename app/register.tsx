import React, { useRef, useEffect, useState } from "react";
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
import { API_URL } from "@/constants/api";

export default function RegistroMueblix() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    password: "",
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  async function handleSubmit() {
    // Validaciones básicas
    if (!form.nombres || !form.apellidos || !form.email || !form.password) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Usuario registrado correctamente");
        router.push("/"); // Volver al inicio después de registrar
      } else {
        Alert.alert("Error", data.message || "No se pudo registrar el usuario");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema al conectarse con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.safeArea} contentContainerStyle={styles.centerContent}>
      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.brand}>Mueblix</Text>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Regístrate y disfruta de la experiencia</Text>

        {/* Inputs */}
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Nombres"
            placeholderTextColor="#94a3b8"
            value={form.nombres}
            onChangeText={(v) => handleChange("nombres", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Apellidos"
            placeholderTextColor="#94a3b8"
            value={form.apellidos}
            onChangeText={(v) => handleChange("apellidos", v)}
          />

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
            placeholder="Teléfono"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={(v) => handleChange("telefono", v)}
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

        {/* Botón Registrar */}
        <TouchableOpacity
          style={styles.btn}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? "Registrando..." : "Registrarme"}</Text>
        </TouchableOpacity>

        {/* Botón Volver al inicio */}
        <TouchableOpacity
          style={[styles.btn, styles.backBtn]}
          onPress={() => router.push("/")}
        >
          <Text style={[styles.btnText, styles.backBtnText]}>Volver al inicio</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

/* -------- ESTILOS -------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 30,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 10,
    alignItems: "center",
  },
  brand: {
    fontSize: 34,
    fontWeight: "900",
    color: "#22c55e",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e2e8f0",
  },
  subtitle: {
    marginTop: 4,
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 30,
  },
  formGroup: {
    width: "100%",
    gap: 16,
  },
  input: {
    backgroundColor: "#0f172a",
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    color: "white",
    borderWidth: 1,
    borderColor: "#334155",
  },
  btn: {
    marginTop: 26,
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 18,
    shadowColor: "#22c55e",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  btnText: {
    textAlign: "center",
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "900",
  },
  backBtn: {
    marginTop: 14,
    backgroundColor: "#334155",
  },
  backBtnText: {
    color: "#cbd5e1",
  },
});
