import React, { useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  Image,
} from 'react-native';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUri?: string; 
}
type PantallaActual = 'inicio' | 'agregar';

interface InicioPantallaProps {
  productos: Producto[];
  alNavegar: (pantalla: PantallaActual) => void;
  alEliminar: (id: string) => void;
}

const InicioPantalla: React.FC<InicioPantallaProps> = ({ productos, alNavegar, alEliminar }) => {

  const manejarEliminar = useCallback((id: string, nombre: string) => {
    Alert.alert(
      "Confirmar Eliminación",
      `¿Estás seguro de que quieres eliminar el producto: ${nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          onPress: () => alEliminar(id),
          style: "destructive"
        }
      ]
    );
  }, [alEliminar]);

  const renderItem = useCallback(({ item }: { item: Producto }) => (
    <View style={estilos.tarjetaProducto}>
      {/* Miniatura de la Imagen */}
      {item.imagenUri ? (
        <Image 
          source={{ uri: item.imagenUri }} 
          style={estilos.imagenMiniatura} 
        />
      ) : (
        <View style={estilos.imagenPlaceholder}>
          <Text style={estilos.textoPlaceholder}></Text>
        </View>
      )}

      <View style={estilos.infoProducto}>
        <Text style={estilos.nombreProducto}>{item.nombre}</Text>
        <Text style={estilos.descripcionProducto} numberOfLines={3}>{item.descripcion}</Text>
      </View>

      <TouchableOpacity
        style={estilos.botonEliminar}
        onPress={() => manejarEliminar(item.id, item.nombre)}
      >
        <Text style={estilos.textoBotonEliminar}>✕</Text> 
      </TouchableOpacity>
    </View>
  ), [manejarEliminar]);

  const ListaVacia = useMemo(() => (
    <View style={estilos.contenedorListaVacia}>
      <Text style={estilos.textoListaVacia}></Text>
      <Text style={estilos.textoListaVacia}>No hay productos agregados. ¡Añade uno para empezar!</Text>
    </View>
  ), []);

  return (
    <View style={estilos.contenedorPrincipal}>
      <Text style={estilos.titulo}>Inventario de Productos</Text>
      
      <TouchableOpacity
        style={estilos.botonAgregar}
        onPress={() => alNavegar('agregar')}
      >
        <Text style={estilos.textoBotonPrincipal}>+ Agregar Nuevo Producto</Text>
      </TouchableOpacity>
      
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={ListaVacia}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    padding: 28,
  },
  titulo: {
    fontSize: 25,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 25,
    textAlign: 'center',
  },
  botonAgregar: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  textoBotonPrincipal: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  tarjetaProducto: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#10b981',
    elevation: 3,
  },
  imagenMiniatura: {
    width: 55, 
    height: 55,
    borderRadius: 8,
    marginRight: 15,
  },
  imagenPlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoPlaceholder: {
    fontSize: 26, 
  },
  infoProducto: {
    flex: 1,
    marginRight: 10,
  },
  nombreProducto: {
    fontSize: 20,
    fontWeight: '700', 
    color: '#1f2937',
  },
  descripcionProducto: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  botonEliminar: {
    backgroundColor: '#ff0000ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  textoBotonEliminar: {
    color: '#ffffffff',
    fontWeight: '900',
    fontSize: 16,
  },
  contenedorListaVacia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  textoListaVacia: {
    fontSize: 18,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default InicioPantalla;