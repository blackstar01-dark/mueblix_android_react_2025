import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from "react-native";

type Producto = {
  id: string;
  nombre: string;
  precio: string | number;
};

type Props = {
  item: Producto;
};

export default function ProductoCard({ item }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        
        {/* Simulación de imagen */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>Imagen</Text>
        </View>

        {/* Nombre del producto */}
        <Text style={styles.name} numberOfLines={2}>
          {item.nombre}
        </Text>

        {/* Precio */}
        <Text style={styles.price}>${Number(item.precio).toFixed(2)}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#1f2937", // gris medio
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#111827", // gris oscuro
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#22272e",
  },
  imageText: {
    color: "#9ca3af", // gris claro para texto de placeholder
    fontSize: 14,
    fontStyle: "italic",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },
  price: {
    fontSize: 17,
    fontWeight: "700",
    color: "#22c55e", // verde Mueblix
  },
});
