import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  Image,
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard, 
  KeyboardAvoidingView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 


type PantallaActual = 'inicio' | 'agregar';

interface AgregarProductoPantallaProps {
  alAgregarProducto: (nombre: string, descripcion: string, imagenUri?: string) => void;
  alNavegar: (pantalla: PantallaActual) => void;
}

const AgregarProductoPantalla: React.FC<AgregarProductoPantallaProps> = ({ alAgregarProducto, alNavegar }) => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const [imagenUri, setImagenUri] = useState<string | undefined>(undefined);
  
  const cerrarTeclado = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const tomarFoto = useCallback(async () => {
    
    if (Platform.OS === 'web' || !ImagePicker.launchCameraAsync) {
        const mockImageUri = 'https://placehold.co/160x160/06b6d4/white?text=Producto+' + Date.now();
        setImagenUri(mockImageUri);
        Alert.alert("Simulación", "Se ha cargado una imagen de prueba. Usa un dispositivo o emulador para la cámara real.");
        return;
    }
    
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraStatus !== 'granted') {
        Alert.alert('Permiso Requerido ', 'Necesitas otorgar permiso para acceder a la cámara.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7, 
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) { 
        setImagenUri(result.assets[0].uri); 
      }

    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      Alert.alert("Error de Cámara", "Hubo un problema al intentar abrir la cámara.");
    }

  }, []);
  const manejarGuardar = useCallback(() => {
    if (nombreProducto.trim() === '' || descripcionProducto.trim() === '') {
      Alert.alert('Error', 'Por favor, ingrese un nombre y una descripción para el producto.', [{ text: 'OK' }]);
      return;
    }
    
    alAgregarProducto(nombreProducto, descripcionProducto, imagenUri);
    
    setNombreProducto('');
    setDescripcionProducto('');
    setImagenUri(undefined);
    
    alNavegar('inicio');
  }, [nombreProducto, descripcionProducto, imagenUri, alAgregarProducto, alNavegar]);

  return (
    <TouchableWithoutFeedback onPress={cerrarTeclado}>
      <KeyboardAvoidingView 
        style={estilos.contenedorPrincipal}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} 
      >
        <Text style={estilos.titulo}>Agregar Nuevo Producto</Text>
        <Text style={estilos.etiqueta}>Foto del Producto</Text>
        <TouchableOpacity style={estilos.botonFoto} onPress={tomarFoto}>
          <Text style={estilos.textoBotonFoto}>
            {imagenUri ? 'Cambiar Foto ' : 'Tomar Foto '}
          </Text>
        </TouchableOpacity>

        {imagenUri && (
          <View style={estilos.contenedorPrevisualizacion}>
            <Image 
              source={{ uri: imagenUri }} 
              style={estilos.imagenPrevisualizacion} 
              resizeMode="cover"
            />
            <Text style={estilos.textoImagenCargada}>Imagen lista para guardar.</Text>
          </View>
        )}

        <Text style={estilos.etiqueta}>Nombre del Producto </Text>
        <TextInput
          style={estilos.entradaTexto}
          placeholder="Ej: Laptop Pro X"
          value={nombreProducto}
          onChangeText={setNombreProducto}
          maxLength={50} 
          returnKeyType="done"
        />

        <Text style={estilos.etiqueta}>Descripción </Text>
        <TextInput
          style={[estilos.entradaTexto, estilos.multilineInput]} 
          placeholder="Portátil de alto rendimiento..."
          multiline
          numberOfLines={4}
          value={descripcionProducto}
          onChangeText={setDescripcionProducto}
          returnKeyType="done"
          onSubmitEditing={cerrarTeclado} 
        />

        <View style={estilos.espacioBoton}>
          <Button 
            title="Guardar Producto" 
            onPress={manejarGuardar} 
            color="#10b981" 
            disabled={!nombreProducto.trim() || !descripcionProducto.trim()} 
          />
        </View>

        <View style={estilos.espacioBoton}>
          <Button 
            title="Cancelar y Volver" 
            onPress={() => alNavegar('inicio')} 
            color="#ef4444" 
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};


const estilos = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 5,
    marginTop: 15,
  },
  entradaTexto: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16,
  },
  multilineInput: {
    height: 100, 
    textAlignVertical: 'top', 
  },
  espacioBoton: {
    marginTop: 15, 
  },
  botonFoto: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBotonFoto: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contenedorPrevisualizacion: {
    alignItems: 'center',
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  imagenPrevisualizacion: {
    width: 160, 
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  textoImagenCargada: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
});

export default AgregarProductoPantalla;