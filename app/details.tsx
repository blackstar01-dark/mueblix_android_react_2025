// app/details.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getProductosDetails } from "@/hook/api";

type Producto = {
  _id: string;
  nombre: string;
  precio: string | number;
  cantidad?: number;
  estatus?: string;
  categoria?: { nombre: string };
  caracteristicas?: {
    tipo?: string;
    descripcion?: string;
    color?: string;
    peso?: number;
  };
  imagen?: string[];
  sensor?: {
    lectura?: { valor: number; fecha: string };
    nombre?: string;
    tipo?: string;
    estado?: string;
  };
};

export default function ProductoDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProducto();
  }, [id]);

  const loadProducto = async () => {
    try {
      setLoading(true);
      const data = await getProductosDetails(id);
      setProducto(data);
    } catch (error) {
      console.error("Error al cargar producto:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!producto) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#fff" }}>Producto no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      {producto.imagen && producto.imagen.length > 0 && (
        <Image source={{ uri: producto.imagen[0] }} style={styles.image} />
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        {producto.categoria && <Text style={styles.categoria}>{producto.categoria.nombre}</Text>}
        <Text style={styles.precio}>${producto.precio}</Text>
        {producto.caracteristicas?.descripcion && (
          <Text style={styles.descripcion}>{producto.caracteristicas.descripcion}</Text>
        )}
        {producto.caracteristicas?.tipo && (
          <Text style={styles.detalle}>Tipo: {producto.caracteristicas.tipo}</Text>
        )}
        {producto.caracteristicas?.color && (
          <Text style={styles.detalle}>Color: {producto.caracteristicas.color}</Text>
        )}
        {producto.caracteristicas?.peso && (
          <Text style={styles.detalle}>Peso: {producto.caracteristicas.peso} kg</Text>
        )}

        {producto.sensor?.lectura?.valor !== undefined && (
          <Text style={styles.sensor}>
            {producto.sensor.tipo}: {producto.sensor.lectura.valor}
          </Text>
        )}

        <TouchableOpacity style={styles.btnAgregar}>
          <Text style={styles.btnText}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { padding: 12, marginLeft: 12, marginTop: 12, backgroundColor: "#1e293b", borderRadius: 10, width: 100 },
  backText: { color: "#22c55e", fontWeight: "700" },
  image: { width: "100%", height: 250, borderRadius: 20, marginTop: 20 },
  infoContainer: { paddingHorizontal: 20, paddingTop: 20 },
  nombre: { fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 6 },
  categoria: { fontSize: 14, color: "#94a3b8", marginBottom: 10 },
  precio: { fontSize: 20, fontWeight: "700", color: "#22c55e", marginBottom: 15 },
  descripcion: { fontSize: 14, color: "#cbd5e1", marginBottom: 10 },
  detalle: { fontSize: 14, color: "#cbd5e1", marginBottom: 5 },
  sensor: { fontSize: 14, color: "#facc15", marginBottom: 15, fontWeight: "700" },
  btnAgregar: { backgroundColor: "#22c55e", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  btnText: { color: "#0f172a", fontSize: 16, fontWeight: "700" },
});
