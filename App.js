import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photos, setPhotos] = useState([]);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setPhotos((prev) => [...prev, photo]);
      setIsCameraActive(false);
    }
  };


  const pickPhotoFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.cancelled) {
      setPhotos((prev) => [...prev, result]);
    }
  };


  const deletePhoto = (index) => {
    Alert.alert('Excluir Foto', 'Deseja realmente excluir esta foto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const updatedPhotos = [...photos];
          updatedPhotos.splice(index, 1);
          setPhotos(updatedPhotos);
        },
      },
    ]);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permissão para acessar a câmera negada.</Text>;
  }

  return (
    <View style={styles.container}>
      {isCameraActive ? (
        <Camera style={styles.camera} ref={(ref) => setCamera(ref)}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.button} onPress={() => setIsCameraActive(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Capturar</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={() => setIsCameraActive(true)}>
              <Text style={styles.buttonText}>Abrir Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickPhotoFromGallery}>
              <Text style={styles.buttonText}>Galeria</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={photos}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Animated.View
                style={styles.photoContainer}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <Image source={{ uri: item.uri }} style={styles.photo} />
                <TouchableOpacity style={styles.deleteButton} onPress={() => deletePhoto(index)}>
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
