import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export type BookStatus = 'TO_READ' | 'COMPLETED' | 'READING';

interface BookEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: BookEditData) => void;
  type: 'rating' | 'status' | 'volume';
  currentValue: number | BookStatus;
  maxVolume?: number;
}

export interface BookEditData {
  type: 'rating' | 'status' | 'volume';
  value: number | BookStatus;
}

const STATUS_TRANSLATIONS: Record<BookStatus, string> = {
  TO_READ: 'À lire',
  COMPLETED: 'Terminé',
  READING: 'En cours',
};

const STATUS_OPTIONS: BookStatus[] = ['TO_READ', 'READING', 'COMPLETED'];

export default function BookEditModal({ 
  visible, 
  onClose, 
  onSave, 
  type, 
  currentValue, 
  maxVolume = 0 
}: BookEditModalProps) {
  const { theme } = useTheme();
  const [selectedValue, setSelectedValue] = useState<number | BookStatus>(currentValue);

  useEffect(() => {
    setSelectedValue(currentValue);
  }, [currentValue, visible]);

  const handleSave = () => {
    onSave({ type, value: selectedValue });
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'rating': return 'Modifier la note';
      case 'status': return 'Modifier le statut';
      case 'volume': return 'Modifier le volume';
      default: return 'Modifier';
    }
  };

  const renderRatingSelector = () => (
    <View style={styles.optionsContainer}>
      {Array.from({ length: 11 }, (_, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.ratingOption,
            selectedValue === i && { backgroundColor: theme.colors.accent }
          ]}
          onPress={() => setSelectedValue(i)}
        >
          <Text style={[
            styles.ratingText,
            { color: selectedValue === i ? 'black' : theme.colors.white }
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStatusSelector = () => (
    <View style={styles.optionsContainer}>
      {STATUS_OPTIONS.map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.statusOption,
            selectedValue === status && { backgroundColor: theme.colors.accent }
          ]}
          onPress={() => setSelectedValue(status)}
        >
          <Text style={[
            styles.statusText,
            { color: selectedValue === status ? 'black' : theme.colors.white }
          ]}>
            {STATUS_TRANSLATIONS[status]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderVolumeSelector = () => (
    <View style={styles.optionsContainer}>
      {Array.from({ length: maxVolume + 1 }, (_, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.volumeOption,
            selectedValue === i && { backgroundColor: theme.colors.accent }
          ]}
          onPress={() => setSelectedValue(i)}
        >
          <Text style={[
            styles.volumeText,
            { color: selectedValue === i ? 'black' : theme.colors.white }
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (type) {
      case 'rating': return renderRatingSelector();
      case 'status': return renderStatusSelector();
      case 'volume': return renderVolumeSelector();
      default: return null;
    }
  };

  const hasChanges = selectedValue !== currentValue;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={[theme.gradient.start, theme.gradient.end]}
          style={styles.modalContent}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.white }]}>
              {getTitle()}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderContent()}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.colors.white }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.white }]}>
                Annuler
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: hasChanges ? theme.colors.accent : 'rgba(255, 255, 255, 0.3)',
                  opacity: hasChanges ? 1 : 0.5
                }
              ]}
              onPress={handleSave}
              disabled={!hasChanges}
            >
              <Text style={[
                styles.saveButtonText, 
                { color: hasChanges ? 'black' : theme.colors.white }
              ]}>
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
    maxHeight: 300,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Rating styles
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  ratingOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Status styles
  statusOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 100,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Volume styles
  volumeOption: {
    width: 60,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
