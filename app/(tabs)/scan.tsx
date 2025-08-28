import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useFocusEffect } from '@react-navigation/native';
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
  const [cameraKey, setCameraKey] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    registerScanCallback(takePicture);
    return () => {
      unregisterScanCallback();
    };
  }, [registerScanCallback, unregisterScanCallback]);

  // Traiter l'image capturée de manière asynchrone
  useEffect(() => {
    if (capturedImage && !isProcessing) {
      processAndSendImage();
    }
  }, [capturedImage, isProcessing, jwtToken]);

  // Réinitialiser l'état à chaque focus de la page
  useFocusEffect(
    React.useCallback(() => {
      setCapturedImage(null);
      setIsScanning(false);
      setIsProcessing(false);
      setCameraKey(prev => prev + 1);
      
      console.log('Page scan focus - état réinitialisé, caméra rechargée');
    }, [])
  );

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsScanning(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        // Recadrer l'image pour isoler seulement la zone dans le cadre
        const { width: imageWidth, height: imageHeight } = photo;
        const frameWidth = 250;
        const frameHeight = 350;
        
        // Calculer les coordonnées de recadrage (zone centrale)
        const cropX = (imageWidth - frameWidth) / 2;
        const cropY = (imageHeight - frameHeight) / 2;
        
        const croppedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            { 
              crop: { 
                originX: cropX, 
                originY: cropY, 
                width: frameWidth, 
                height: frameHeight 
              } 
            },
          ],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        setCapturedImage(croppedImage.uri);
        setIsScanning(false);
      } catch (error) {
        console.error('Erreur lors de la prise de photo:', error);
        setIsScanning(false);
        Alert.alert('Erreur', 'Impossible de prendre la photo');
      }
    }
  };

  const processAndSendImage = async () => {
    if (!capturedImage || !jwtToken) return;

    try {
      setIsProcessing(true);
      
      const formData = new FormData();
      formData.append('image', {
        uri: capturedImage,
        type: 'image/jpeg',
        name: 'cover.jpg',
      } as any);

      const response = await apiClient.scanCover(formData, jwtToken);
      
      Alert.alert('Succès', 'Couverture scannée avec succès !');
      console.log('Résultat du scan:', response);
      
      setCapturedImage(null);
      
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      Alert.alert('Erreur', 'Impossible de traiter l\'image');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (cameraError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.textPrimary }]}>
            {cameraError}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.accent }]}
            onPress={() => {
              setCameraError(null);
              setCameraKey(prev => prev + 1);
            }}
          >
            <Text style={[styles.retryButtonText, { color: 'black' }]}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <View style={styles.cameraContainer}>
        <CameraView
          key={cameraKey}
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onMountError={(error) => {
            console.error('Erreur de montage de la caméra:', error);
            setCameraError('Erreur de chargement de la caméra');
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={styles.corner} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
          </View>
        </CameraView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});


