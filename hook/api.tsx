import { API_URL } from "@/constants/api";

export async function getProductos() {
    try {
        const url = `${API_URL}/producto?limit=20&offset=0`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getProductos:", error);
        throw error;
    }
}

export async function getProductosDetails(id: string) {
    try {
        const url = `${API_URL}/producto/${id}`;
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error al obtener los datos");
        throw error;
    }
}