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

  const takePicture = React.useCallback(async () => {
    if (cameraRef.current && cameraLayout.width > 0 && cameraLayout.height > 0) {
      try {
        setIsScanning(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        // Calculer le ratio de l'image et prendre seulement la partie scannée en qualité reduite pour l'envoi
        const { width: imageWidth, height: imageHeight } = photo;
        const previewWidth = cameraLayout.width;
        const previewHeight = cameraLayout.height;
        
        const imageAspectRatio = imageWidth / imageHeight;
        const previewAspectRatio = previewWidth / previewHeight;
  
        let cropX, cropY, actualFrameWidth, actualFrameHeight;
  
        if (imageAspectRatio > previewAspectRatio) {
          const scale = imageHeight / previewHeight;
          actualFrameWidth = SCAN_FRAME_WIDTH * scale;
          actualFrameHeight = SCAN_FRAME_HEIGHT * scale;
          
          cropX = (imageWidth - actualFrameWidth) / 2;
          cropY = (imageHeight - actualFrameHeight) / 2;
        } else {
          const scale = imageWidth / previewWidth;
          actualFrameWidth = SCAN_FRAME_WIDTH * scale;
          actualFrameHeight = SCAN_FRAME_HEIGHT * scale;
          
          cropX = (imageWidth - actualFrameWidth) / 2;
          cropY = (imageHeight - actualFrameHeight) / 2;
        }
  
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
        console.error('❌ Erreur lors de la prise de photo:', error);
        setIsScanning(false);
      }
    } else {
      Alert.alert('Erreur', 'Caméra non prête. Attendez que la caméra soit initialisée.');
    }
    }, [cameraLayout.width, cameraLayout.height]);

  useEffect(() => {
    registerScanCallback(takePicture);
    return () => {
      unregisterScanCallback();
    };
  }, [takePicture, registerScanCallback, unregisterScanCallback]);

  useEffect(() => {
    if (capturedImage && !isProcessing) {
      processAndSendImage();
    }
  }, [capturedImage, isProcessing, jwtToken]);

  useFocusEffect(
    React.useCallback(() => {
      setCapturedImage(null);
      setIsScanning(false);
      setIsProcessing(false);
      setCameraKey(prev => prev + 1);
      
    }, [])
  );

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
            
            {isScanning && (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator size="large" color={theme.colors.accent} />
                <Text style={[styles.scanningText, { color: theme.colors.accent }]}>
                  Scan en cours...
                </Text>
              </View>
            )}
            
            <View style={styles.instructions}>
              <Text style={[styles.instructionsText, { color: theme.colors.white }]}>
                Placez la couverture du livre dans le cadre
              </Text>
              <Text style={[styles.instructionsSubtext, { color: theme.colors.white }]}>
                Appuyez sur le bouton scan pour analyser
              </Text>
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
  scanningIndicator: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -50 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  scanningText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructions: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  instructionsText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  instructionsSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});


