import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Platform,
} from 'react-native';

import InicioPantalla from './/screens/inicio';
import AgregarProductoPantalla from './/screens/añadir';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUri?: string; 
}
type PantallaActual = 'inicio' | 'agregar';

const App: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pantallaActual, setPantallaActual] = useState<PantallaActual>('inicio');

  const agregarProducto = useCallback((nombre: string, descripcion: string, imagenUri?: string) => {
    const nuevoProducto: Producto = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      imagenUri,
    };
    setProductos(prevProductos => [...prevProductos, nuevoProducto]);
  }, []);

  const eliminarProducto = useCallback((id: string) => {
    setProductos(prevProductos => prevProductos.filter(p => p.id !== id));
  }, []);

  const navegarA = useCallback((pantalla: PantallaActual) => {
    setPantallaActual(pantalla);
  }, []);

  const renderizarPantalla = useMemo(() => {
    if (pantallaActual === 'inicio') {
      return (
        <InicioPantalla 
          productos={productos} 
          alNavegar={navegarA} 
          alEliminar={eliminarProducto} 
        />
      );
    }
    return (
      <AgregarProductoPantalla 
        alAgregarProducto={agregarProducto} 
        alNavegar={navegarA} 
      />
    );
  }, [pantallaActual, productos, navegarA, eliminarProducto, agregarProducto]);

  return (
    <View style={estilos.contenedorApp}>
      {renderizarPantalla}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedorApp: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 40, 
    backgroundColor: '#f8f8f8',
  },
});

export default App;