import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ProductoCard from "./productoCard";

type Producto = {
  id: string;
  nombre: string;
  precio: string | number;
};

type Props = {
  productos: Producto[];
};

export default function ProductoList({ productos }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>

      <FlatList
        data={productos}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item }) => <ProductoCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "#111827", // gris oscuro de fondo
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginVertical: 15,
    color: "#22c55e", // verde Mueblix
  },
  row: {
    justifyContent: "space-between",
  },
});
