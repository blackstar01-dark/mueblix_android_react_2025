// ProductoList.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import ProductoCard from "./productoCard";
import { router } from "expo-router";

type Producto = {
  id: string;
  nombre: string;
  precio: string | number;
};

type Props = {
  productos: Producto[];
  onAddToCart?: (producto: Producto) => void;
};

const screenWidth = Dimensions.get("window").width;
const COLUMN_COUNT = 2;
const CARD_MARGIN = 12; // aumentamos margen para pantallas grandes
const CARD_WIDTH = (screenWidth - CARD_MARGIN * (COLUMN_COUNT * 2 + 2)) / COLUMN_COUNT;

export default function ProductoList({ productos, onAddToCart }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>

      <FlatList
        data={productos}
        numColumns={COLUMN_COUNT}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }} // un poco más para comodidad
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: CARD_MARGIN * 2 }}
        renderItem={({ item }) => (
          <ProductoCard
            item={item}
            onPress={() => router.push(`/details?id=${item.id}`)}
            onAddToCart={() => onAddToCart?.(item)}
            style={{
              width: CARD_WIDTH,
              margin: CARD_MARGIN,
              padding: 10, // agregado para tarjetas más espaciosas
            }}
    
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16, // aumentamos padding horizontal
    backgroundColor: "#111827",
  },
  title: {
    fontSize: 28, // un poco más grande para pantallas grandes
    fontWeight: "800",
    marginVertical: 20,
    color: "#22c55e",
  },
});
