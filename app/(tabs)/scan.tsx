import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../services/api/client';
import { useScanContext } from '../../contexts/ScanContext';

export default function ScanPage() {
  const { theme } = useTheme();
  const { jwtToken } = useAuth();
  const { registerScanCallback, unregisterScanCallback } = useScanContext();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  // Utiliser le hook officiel pour les permissions
  const [permission, requestPermission] = useCameraPermissions();

  // S'enregistrer comme callback de scan quand la page est montée
  useEffect(() => {
    registerScanCallback(takePicture);
    return () => {
      unregisterScanCallback();
    };
  }, [registerScanCallback, unregisterScanCallback]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsScanning(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        setCapturedImage(photo.uri);
        setIsScanning(false);
      } catch (error) {
        console.error('Erreur lors de la prise de photo:', error);
        setIsScanning(false);
        Alert.alert('Erreur', 'Impossible de prendre la photo');
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const processAndSendImage = async () => {
    if (!capturedImage || !jwtToken) return;

    try {
      setIsProcessing(true);
      
      // Recadrer l'image pour isoler la couverture (approximation)
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        capturedImage,
        [
          { crop: { originX: 0, originY: 0, width: 800, height: 1200 } }, // Format BD standard
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Créer un FormData pour l'envoi
      const formData = new FormData();
      formData.append('image', {
        uri: manipulatedImage.uri,
        type: 'image/jpeg',
        name: 'cover.jpg',
      } as any);

      // Envoyer à l'API
      const response = await apiClient.scanCover(formData, jwtToken);
      
      Alert.alert('Succès', 'Couverture scannée avec succès !');
      console.log('Résultat du scan:', response);
      
      // Réinitialiser
      setCapturedImage(null);
      
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      Alert.alert('Erreur', 'Impossible de traiter l\'image');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Vérifier les permissions selon la nouvelle API
  if (!permission) {
    // Les permissions de caméra sont encore en cours de chargement
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={[styles.text, { color: theme.colors.textPrimary }]}>
          Chargement des permissions...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Les permissions de caméra ne sont pas accordées
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
        <Text style={[styles.text, { color: theme.colors.textPrimary }]}>
          Nous avons besoin de votre permission pour accéder à la caméra
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.accent }]}
          onPress={requestPermission}
        >
          <Text style={[styles.buttonText, { color: 'black' }]}>Accorder la permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Aperçu de la couverture
        </Text>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.overlay}>
            <Text style={[styles.overlayText, { color: theme.colors.textPrimary }]}>
              Couverture détectée
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
            onPress={retakePicture}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>Reprendre</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.accent }]}
            onPress={processAndSendImage}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={[styles.buttonText, { color: 'black' }]}>Scanner</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Scanner une couverture
      </Text>
      
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Placez la couverture de la BD dans le cadre et appuyez sur le bouton
      </Text>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={styles.corner} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
            <Text style={[styles.overlayText, { color: 'white' }]}>
              Alignez la couverture dans le cadre
            </Text>
          </View>
        </CameraView>
        
        {/* Bouton de scan flottant au centre */}
        <View style={styles.scanButtonContainer}>
          <TouchableOpacity 
            style={[styles.scanButton, { backgroundColor: theme.colors.accent }]}
            onPress={takePicture}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator color="black" size="large" />
            ) : (
              <View style={styles.scanButtonInner}>
                <Ionicons name="scan-outline" size={32} color="black" />
                <Text style={[styles.scanButtonText, { color: 'black' }]}>
                  SCANNER
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.backgroundSecondary }]}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.buttonText}>Changer de caméra</Text>
        </TouchableOpacity>
        
        {/* Bouton de scan principal */}
        <TouchableOpacity 
          style={[styles.mainScanButton, { backgroundColor: theme.colors.accent }]}
          onPress={takePicture}
          disabled={isScanning}
        >
          {isScanning ? (
            <ActivityIndicator color="black" size="large" />
          ) : (
            <View style={styles.mainScanButtonContent}>
              <Ionicons name="scan-outline" size={24} color="black" />
              <Text style={[styles.mainScanButtonText, { color: 'black' }]}>
                SCANNER LA COUVERTURE
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 350,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#00FF00',
    borderWidth: 3,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  overlayText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  scanButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonInner: {
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainScanButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mainScanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainScanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});


