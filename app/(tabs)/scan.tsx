import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../services/api/client';
import { useScanContext } from '../../contexts/ScanContext';

// Constantes pour les dimensions du scanFrame
const SCAN_FRAME_WIDTH = 300;
const SCAN_FRAME_HEIGHT = 400;

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
  const [cameraLayout, setCameraLayout] = useState({ width: 0, height: 0 });
  
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
      // En mode debug, on ne traite pas automatiquement l'image
      // processAndSendImage(); // DÉSACTIVÉ TEMPORAIREMENT
      console.log('DEBUG: Image capturée, mode debug activé');
    }
  }, [capturedImage, isProcessing, jwtToken]);

  // Réinitialiser l'état à chaque focus de la page
  useFocusEffect(
    React.useCallback(() => {
      setCapturedImage(null);
      setIsScanning(false);
      setIsProcessing(false);
      setCameraKey(prev => prev + 1);
      
    }, [])
  );

  const takePicture = async () => {
    if (cameraRef.current && cameraLayout.width > 0 && cameraLayout.height > 0) {
      try {
        setIsScanning(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
  
        const { width: imageWidth, height: imageHeight } = photo;
        const previewWidth = cameraLayout.width;
        const previewHeight = cameraLayout.height;
  
        // Calculate the image's aspect ratio
        const imageAspectRatio = imageWidth / imageHeight;
        // Calculate the preview container's aspect ratio
        const previewAspectRatio = previewWidth / previewHeight;
  
        let cropX, cropY, actualFrameWidth, actualFrameHeight;
  
        if (imageAspectRatio > previewAspectRatio) {
          // The image is wider than the preview, so the height is constrained.
          // We calculate scale based on height, which is correctly matched.
          const scale = imageHeight / previewHeight;
          actualFrameWidth = SCAN_FRAME_WIDTH * scale;
          actualFrameHeight = SCAN_FRAME_HEIGHT * scale;
          
          // Center the crop horizontally
          cropX = (imageWidth - actualFrameWidth) / 2;
          cropY = (imageHeight - actualFrameHeight) / 2;
        } else {
          // The image is taller than the preview, so the width is constrained.
          // We calculate scale based on width.
          const scale = imageWidth / previewWidth;
          actualFrameWidth = SCAN_FRAME_WIDTH * scale;
          actualFrameHeight = SCAN_FRAME_HEIGHT * scale;
          
          // Center the crop vertically
          cropX = (imageWidth - actualFrameWidth) / 2;
          cropY = (imageHeight - actualFrameHeight) / 2;
        }
  
        console.log('Recadrage final:', {
          image: { width: imageWidth, height: imageHeight },
          preview: { width: previewWidth, height: previewHeight },
          actualFrame: { width: actualFrameWidth, height: actualFrameHeight },
          crop: { x: cropX, y: cropY, width: actualFrameWidth, height: actualFrameHeight }
        });
  
        const croppedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                originX: cropX,
                originY: cropY,
                width: actualFrameWidth,
                height: actualFrameHeight,
              },
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
    if (!capturedImage) return;

    try {
      setIsProcessing(true);
      
      // TEMPORAIRE : Afficher l'image au lieu d'envoyer l'API
              console.log('DEBUG: Image recadrée affichée:', capturedImage);
        
        // En mode debug, on affiche directement l'image
        // Pas besoin de processAndSendImage
        setIsProcessing(false);
      
    } catch (error) {
      console.error('Erreur lors du debug:', error);
      Alert.alert('Erreur', 'Erreur lors du debug');
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
        <View style={styles.debugContainer}>
          <Text style={[styles.debugTitle, { color: theme.colors.textPrimary }]}>
            DEBUG: Image recadrée
          </Text>
          <Image 
            source={{ uri: capturedImage }} 
            style={styles.debugImage}
            resizeMode="contain"
          />
          <View style={styles.debugButtons}>
            <TouchableOpacity 
              style={[styles.debugButton, { backgroundColor: theme.colors.accent }]}
              onPress={() => setCapturedImage(null)}
            >
              <Text style={[styles.debugButtonText, { color: 'black' }]}>Nouveau scan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.debugButton, { backgroundColor: '#FF6B6B' }]}
              onPress={() => {
                console.log('DEBUG: URI de l\'image:', capturedImage);
                Alert.alert('DEBUG', 'URI copié dans la console !');
              }}
            >
              <Text style={[styles.debugButtonText, { color: 'white' }]}>Voir URI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <View 
        style={styles.cameraContainer} 
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCameraLayout({ width, height });
        }}
      >
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
    width: SCAN_FRAME_WIDTH,
    height: SCAN_FRAME_HEIGHT,
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
  // Styles pour le debug
  debugContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  debugImage: {
    width: 300,
    height: 400,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00FF00',
  },
  debugButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  debugButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  debugButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});


