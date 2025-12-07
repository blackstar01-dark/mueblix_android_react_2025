import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Producto = {
  id: string;
  nombre: string;
  precio: string | number;
};

type Props = {
  item: Producto;
  onPress?: () => void;
  onAddToCart?: () => void;
  style?: object;
};

export default function ProductoCard({ item, onPress, onAddToCart, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.precio}>${item.precio}</Text>

      <View style={styles.buttons}>
        {onPress && (
          <TouchableOpacity style={styles.btnDetalle} onPress={onPress}>
            <Text style={styles.btnTextDetalle}>Ver detalles →</Text>
          </TouchableOpacity>
        )}
        {onAddToCart && (
          <TouchableOpacity style={styles.btnAgregar} onPress={onAddToCart}>
            <Text style={styles.btnTextAgregar}>Agregar al carrito</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16, // aumentamos padding
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  nombre: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 18, // aumentado
    marginBottom: 6 
  },
  precio: { 
    color: "#22c55e", 
    fontWeight: "700", 
    fontSize: 16, // aumentado
    marginBottom: 10 
  },
  buttons: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 10 
  },
  btnDetalle: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingVertical: 10, // aumentado
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  btnTextDetalle: { 
    color: "#22c55e", 
    fontSize: 14, // aumentado
    fontWeight: "700" 
  },
  btnAgregar: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: 10, // aumentado
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  btnTextAgregar: { 
    color: "#0f172a", 
    fontSize: 14, // aumentado
    fontWeight: "700" 
  },
});
