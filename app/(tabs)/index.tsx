import { View, SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { getProductos, getProductosDetails } from '../../hook/api';
import ProductoList from "@/components/productoList";

export default function Index() {
  type Producto = { id: string; nombre: string; precio: number | string };

  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    (async () => await loadProductos())();
  }, []);

  const loadProductos = async () => {
    try {
      const response = await getProductos();
      const detallesArray: Producto[] = [];

      for await (const producto of response.data) {
        const productoDetails = await getProductosDetails(producto._id);

        detallesArray.push({
          id: productoDetails.data._id,
          nombre: productoDetails.data.nombre,
          precio: productoDetails.data.precio,
        });
      }

      setProductos(detallesArray);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Encabezado centrado y más grande */}
      <View style={styles.headerContainer}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Mueblix</Text>
          <Text style={styles.headerSubtitle}>Encuentra los mejores muebles para tu hogar</Text>
        </View>
      </View>

      {/* Scroll principal */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ProductoList productos={productos} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1f2937",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerCard: {
    width: '100%',
    backgroundColor: "#111827",
    borderRadius: 24,
    paddingVertical: 40,   // mayor altura
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 36,   // más grande
    fontWeight: "bold",
    color: "#22c55e",
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 18,   // más grande
    fontWeight: "500",
    color: "#d1d5db",
    marginTop: 10,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 16,
  },
});
