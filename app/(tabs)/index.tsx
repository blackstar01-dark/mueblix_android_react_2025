// app/(tabs)/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import ProductoList from "@/components/productoList";
import { getProductos, getProductosDetails } from "../../hook/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const screenWidth = Dimensions.get("window").width;

export default function Index() {
  type Producto = { id: string; nombre: string; precio: number | string };
  type Usuario = { nombres: string; apellidos: string; email: string; id?: string };

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cart, setCart] = useState<Producto[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    checkUsuario();
    loadProductos();
  }, []);

  // ----------------- FUNCIONES -----------------
  const checkUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        setUsuario({
          nombres: decoded.nombres,
          apellidos: decoded.apellidos,
          email: decoded.email,
          id: decoded.id,
        });
      }
    } catch (error) {
      console.error("Error al leer token:", error);
    }
  };

  const cerrarSesion = async () => {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          setUsuario(null);
          router.replace("/login");
        },
      },
    ]);
  };

  const loadProductos = async () => {
    try {
      setLoading(true);
      const productosArray = await getProductos();
      const detallesArray: Producto[] = [];

      for (const producto of productosArray) {
        const productoDetails = await getProductosDetails(producto._id);
        detallesArray.push({
          id: productoDetails._id,
          nombre: productoDetails.nombre,
          precio: productoDetails.precio,
        });
      }

      setProductos(detallesArray);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (producto: Producto) => {
    setCart((prev) => [...prev, producto]);
    setCartCount((prev) => prev + 1);
    Alert.alert("Agregado al carrito", `${producto.nombre} ha sido agregado.`);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
    setCartCount((prev) => prev - 1);
  };

  const crearPedido = async () => {
    if (!usuario) {
      Alert.alert("Error", "Debes iniciar sesión para hacer un pedido");
      return;
    }
    if (cart.length === 0) {
      Alert.alert("Error", "Tu carrito está vacío");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const total = Number(cart.reduce((sum, item) => sum + Number(item.precio), 0));
      const cantidad = cart.length;

      const pedidoData = {
        producto: cart.map((p) => p.id),
        cantidad,
        total,
        estado: "pendiente",
        pago: {
          estatus_pago: "pendiente",
          metodo_pago: "no definido",
        },
      };

      const BACKEND_URL = "http://172.16.100.175:3000/pedido"; // IP local

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pedidoData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear pedido");
      }

      Alert.alert("Éxito", "Pedido creado correctamente");
      setCart([]);
      setCartCount(0);
      setCartVisible(false);
    } catch (error: any) {
      console.error("Error al crear pedido:", error);
      Alert.alert("Error", error.message || "No se pudo crear el pedido");
    }
  };

  // ----------------- RENDER -----------------
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.headerHero}>
        <View style={styles.topBar}>
          <Text style={styles.brandSmall}>Mueblix</Text>
          <View style={styles.topButtons}>
            {usuario ? (
              <>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>
                  {usuario.nombres} {usuario.apellidos}
                </Text>
                <TouchableOpacity style={styles.logoutBtn} onPress={cerrarSesion}>
                  <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.registerBtn} onPress={() => router.push("/login")}>
                <Text style={styles.registerText}>Registrarse</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cartBtn} onPress={() => setCartVisible(true)}>
              <Ionicons name="cart-outline" size={32} color="#22c55e" />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* PRODUCTOS */}
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando productos...</Text>
        ) : (
          <ProductoList productos={productos} onAddToCart={handleAddToCart} />
        )}
      </View>

      {/* MODAL CARRITO */}
      <Modal visible={cartVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Carrito</Text>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {cart.length === 0 ? (
              <Text style={styles.modalEmpty}>Tu carrito está vacío</Text>
            ) : (
              <>
                <FlatList
                  data={cart}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                      <Text style={styles.cartItemName}>{item.nombre}</Text>
                      <Text style={styles.cartItemPrice}>${item.precio}</Text>
                      <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)}>
                        <Text style={styles.cartItemRemove}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                <Text style={styles.cartTotal}>
                  Total: ${cart.reduce((sum, item) => sum + Number(item.precio), 0)}
                </Text>

                <TouchableOpacity style={styles.createOrderBtn} onPress={crearPedido}>
                  <Text style={styles.createOrderText}>Crear pedido</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeCartBtn} onPress={() => setCartVisible(false)}>
            <Text style={styles.closeCartText}>Cerrar carrito</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ----------------- ESTILOS -----------------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0f172a" },

  // HEADER
  headerHero: { paddingHorizontal: 24, paddingTop: 50, paddingBottom: 50, backgroundColor: "#1a2636" },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brandSmall: { fontSize: 32, fontWeight: "900", color: "#22c55e" },
  topButtons: { flexDirection: "row", alignItems: "center", gap: 12, flexShrink: 1 },
  userName: { color: "#22c55e", fontWeight: "700", fontSize: 16, marginRight: 10, maxWidth: 140, flexShrink: 1 },
  registerBtn: { paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#22c55e", borderRadius: 14 },
  registerText: { color: "#0f172a", fontWeight: "700", fontSize: 15 },
  logoutBtn: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#ef4444", borderRadius: 12 },
  logoutText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  cartBtn: { padding: 6, position: "relative", zIndex: 10 },
  badge: { position: "absolute", right: -5, top: -5, backgroundColor: "#ef4444", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  // CONTENIDO
  content: { flex: 1, paddingHorizontal: 16, marginTop: 20 },
  loadingText: { color: "#cbd5e1", textAlign: "center", marginTop: 20, fontSize: 17 },

  // MODAL
  modalContainer: { flex: 1, backgroundColor: "#0f172a", padding: 16, justifyContent: "space-between" },
  modalTitle: { color: "#22c55e", fontSize: 24, fontWeight: "700", marginBottom: 16 },
  modalEmpty: { color: "#cbd5e1", fontSize: 16 },
  cartItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  cartItemName: { color: "#cbd5e1", fontSize: 17 },
  cartItemPrice: { color: "#22c55e", fontSize: 17 },
  cartItemRemove: { color: "#ef4444", fontWeight: "700" },
  cartTotal: { color: "#22c55e", fontSize: 20, fontWeight: "700", marginTop: 14 },
  createOrderBtn: { marginTop: 14, backgroundColor: "#22c55e", padding: 14, borderRadius: 12, alignItems: "center" },
  createOrderText: { color: "#0f172a", fontWeight: "700", fontSize: 16 },
  closeCartBtn: { marginTop: 14, backgroundColor: "#1a2636", padding: 14, borderRadius: 12, alignItems: "center" },
  closeCartText: { color: "#cbd5e1", fontWeight: "700", fontSize: 16 },
});
