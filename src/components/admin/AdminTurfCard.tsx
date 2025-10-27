import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Turf } from '../../types';
import { COLORS } from '../../constants/colors';
import { formatPhoneForDisplay } from '../../utils/phoneUtils';
import { adminAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

interface AdminTurfCardProps {
  turf: Turf;
  onEdit: () => void;
  onDelete: () => void;
  onPress?: () => void;
  onImagesUpdated?: () => void | Promise<void>; // Callback to refresh turf data
}

const AdminTurfCard: React.FC<AdminTurfCardProps> = ({
  turf,
  onEdit,
  onDelete,
  onPress,
  onImagesUpdated,
}) => {
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  
  // Use the availability property directly from the turf data
  const availabilityStatus = turf.availability ?? true;
  
  const hasImages = turf.images && turf.images.length > 0;

  const selectImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions?.Images || 'images' as any,
        allowsMultipleSelection: true,
        quality: 0.3,
        aspect: [4, 3],
        base64: true,
        allowsEditing: false,
      });

      if (!result.canceled) {
        setSelectedImages(result.assets);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to select images',
      });
    }
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select images to upload',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      selectedImages.forEach((asset, index) => {
        formData.append('images', {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        } as any);
      });

      await adminAPI.uploadTurfImages(turf.id, formData);
      
      setSelectedImages([]);
      setShowImagesModal(false);
      
      // Refresh turf data in parent component
      if (onImagesUpdated) {
        await onImagesUpdated();
      }
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Images uploaded successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to upload images',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const closeModal = () => {
    setShowImagesModal(false);
    setSelectedImages([]);
    setDeleteMode(false);
    setSelectedImageUrls([]);
    setImageRefreshKey(Date.now()); // Refresh images on modal close
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedImageUrls([]);
  };

  const toggleImageSelection = (imageUrl: string) => {
    if (selectedImageUrls.includes(imageUrl)) {
      setSelectedImageUrls(selectedImageUrls.filter(url => url !== imageUrl));
    } else {
      setSelectedImageUrls([...selectedImageUrls, imageUrl]);
    }
  };

  const deleteSelectedImages = async () => {
    if (selectedImageUrls.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select images to delete',
      });
      return;
    }

    Alert.alert(
      'Delete Images',
      `Are you sure you want to delete ${selectedImageUrls.length} image${selectedImageUrls.length !== 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              console.log('🗑️ Deleting images:', selectedImageUrls);
              console.log('📍 Turf ID:', turf.id);
              console.log('🔍 Sample URL format:', selectedImageUrls[0]);
              
              await adminAPI.deleteTurfImages(turf.id, selectedImageUrls);
              
              // Clear local state immediately
              setSelectedImageUrls([]);
              setDeleteMode(false);
              
              // Close and reopen modal to force re-render with fresh data
              setShowImagesModal(false);
              
              // Refresh turf data in parent component
              if (onImagesUpdated) {
                await onImagesUpdated();
              }
              
              // Small delay then reopen modal to show updated images
              setTimeout(() => {
                setImageRefreshKey(Date.now()); // Force re-render images
                setShowImagesModal(true);
              }, 100);
              
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Images deleted successfully',
              });
            } catch (error: any) {
              console.error('❌ Delete images error:', error);
              console.error('📄 Error response:', error.response);
              console.error('🔍 Error data:', error.response?.data);
              
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || error.message || 'Failed to delete images',
              });
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{turf.name}</Text>
          <Text style={styles.location}>{turf.location}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="pencil" size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash" size={18} color={COLORS.red} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setShowImagesModal(true)}
          >
            <Ionicons name="images" size={18} color={COLORS.purple} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Ionicons name="star-outline" size={16} color={COLORS.orange} />
          <Text style={styles.infoText}>Rating: {turf.rating || 'N/A'}</Text>
        </View>

        {turf.contactNumber && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={COLORS.gray} />
            <Text style={styles.infoText}>{formatPhoneForDisplay(turf.contactNumber)}</Text>
          </View>
        )}

        {turf.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <Text style={styles.descriptionText} numberOfLines={3}>
              {turf.description}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.statusIndicator}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: availabilityStatus ? COLORS.green : COLORS.red }
          ]} />
          <Text style={[
            styles.statusText,
            { color: availabilityStatus ? COLORS.green : COLORS.red }
          ]}>
            {availabilityStatus ? 'Active' : 'Inactive'}
          </Text>
        </View>
        <View style={styles.footerRight}>
          {hasImages && (
            <Text style={styles.imageCount}>
              📷 {turf.images!.length} image{turf.images!.length !== 1 ? 's' : ''}
            </Text>
          )}
          <Text style={styles.turfId}>ID: {turf.id}</Text>
        </View>
      </View>

      {/* Images Modal */}
      <Modal
        visible={showImagesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{turf.name} - Images</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Ionicons name="close" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {!deleteMode ? (
              <>
                <TouchableOpacity 
                  style={styles.addImageButton}
                  onPress={selectImages}
                  disabled={uploading || deleting}
                >
                  <Ionicons name="add" size={20} color={COLORS.white} />
                  <Text style={styles.addImageButtonText}>Add Images</Text>
                </TouchableOpacity>
                
                {hasImages && (
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={toggleDeleteMode}
                    disabled={uploading || deleting}
                  >
                    <Ionicons name="trash" size={20} color={COLORS.white} />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
                
                {selectedImages.length > 0 && (
                  <TouchableOpacity 
                    style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
                    onPress={uploadImages}
                    disabled={uploading || deleting}
                  >
                    <Ionicons 
                      name={uploading ? "cloud-upload-outline" : "cloud-upload"} 
                      size={20} 
                      color={COLORS.white} 
                    />
                    <Text style={styles.uploadButtonText}>
                      {uploading ? 'Uploading...' : `Upload ${selectedImages.length} image${selectedImages.length !== 1 ? 's' : ''}`}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.cancelDeleteButton}
                  onPress={toggleDeleteMode}
                  disabled={deleting}
                >
                  <Ionicons name="close" size={20} color={COLORS.gray} />
                  <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                {selectedImageUrls.length > 0 && (
                  <TouchableOpacity 
                    style={[styles.confirmDeleteButton, deleting && styles.uploadButtonDisabled]}
                    onPress={deleteSelectedImages}
                    disabled={deleting}
                  >
                    <Ionicons 
                      name={deleting ? "trash-outline" : "trash"} 
                      size={20} 
                      color={COLORS.white} 
                    />
                    <Text style={styles.confirmDeleteButtonText}>
                      {deleting ? 'Deleting...' : `Delete ${selectedImageUrls.length} image${selectedImageUrls.length !== 1 ? 's' : ''}`}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
          
          <ScrollView style={styles.imagesContainer}>
            {/* Selected Images (to be uploaded) */}
            {selectedImages.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>📤 Selected Images (Ready to Upload)</Text>
                {selectedImages.map((asset, index) => (
                  <View key={`selected-${index}`} style={styles.imageWrapper}>
                    <Image 
                      source={{ uri: asset.uri }} 
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                    <View style={styles.selectedImageFooter}>
                      <Text style={styles.imageIndex}>New Image {index + 1}</Text>
                      <TouchableOpacity 
                        style={styles.removeImageButton}
                        onPress={() => removeSelectedImage(index)}
                      >
                        <Ionicons name="trash" size={16} color={COLORS.red} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
            
            {/* Existing Images */}
            {hasImages && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  🖼️ Current Images
                  {deleteMode && selectedImageUrls.length > 0 && (
                    <Text style={styles.selectionCount}> ({selectedImageUrls.length} selected)</Text>
                  )}
                </Text>
                {turf.images!.map((imageUrl, index) => (
                  <TouchableOpacity 
                    key={`existing-${index}`} 
                    style={[
                      styles.imageWrapper,
                      deleteMode && styles.selectableImageWrapper,
                      deleteMode && selectedImageUrls.includes(imageUrl) && styles.selectedForDeletionWrapper
                    ]}
                    onPress={() => deleteMode && toggleImageSelection(imageUrl)}
                    disabled={!deleteMode}
                  >
                    <Image 
                      source={{ 
                        uri: imageUrl,
                        cache: 'reload' // Force reload image from server
                      }} 
                      style={[
                        styles.modalImage,
                        deleteMode && selectedImageUrls.includes(imageUrl) && styles.selectedModalImage
                      ]}
                      resizeMode="cover"
                      onError={() => console.log(`Failed to load image: ${imageUrl}`)}
                      key={`${imageUrl}-${imageRefreshKey}`} // Force re-render with refresh key
                    />
                    {deleteMode && (
                      <View style={styles.selectionOverlay}>
                        <View style={styles.selectionCheckbox}>
                          {selectedImageUrls.includes(imageUrl) && (
                            <Ionicons name="checkmark" size={16} color={COLORS.white} />
                          )}
                        </View>
                      </View>
                    )}
                    <View style={styles.existingImageFooter}>
                      <Text style={styles.imageIndex}>Image {index + 1}</Text>
                      {deleteMode && (
                        <Text style={[
                          styles.selectionText,
                          selectedImageUrls.includes(imageUrl) && styles.selectedText
                        ]}>
                          {selectedImageUrls.includes(imageUrl) ? 'Selected' : 'Tap to select'}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* No Images State */}
            {!hasImages && selectedImages.length === 0 && (
              <View style={styles.noImagesContainer}>
                <Ionicons name="image-outline" size={64} color={COLORS.gray} />
                <Text style={styles.noImagesText}>No images available</Text>
                <Text style={styles.noImagesSubtext}>Tap "Add Images" to upload photos</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={selectImages}
              disabled={uploading}
            >
              <Text style={styles.selectButtonText}>Select Images</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={uploadImages}
              disabled={uploading}
            >
              <Text style={styles.uploadButtonText}>
                {uploading ? 'Uploading...' : 'Upload Images'}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedImages.length > 0 && (
            <ScrollView horizontal style={styles.selectedImagesContainer}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.selectedImageWrapper}>
                  <Image 
                    source={{ uri: image.uri }} 
                    style={styles.selectedImage}
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeSelectedImage(index)}
                  >
                    <Ionicons name="close" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.navy,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: COLORS.gray,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  imageCount: {
    fontSize: 10,
    color: COLORS.purple,
    fontWeight: '600',
    marginBottom: 2,
  },
  turfId: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.navy,
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesContainer: {
    flex: 1,
    padding: 16,
  },
  imageWrapper: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  modalImage: {
    width: '100%',
    height: 250,
  },
  imageIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.navy,
    padding: 12,
    textAlign: 'center',
    backgroundColor: COLORS.white,
  },
  noImagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noImagesText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 16,
    textAlign: 'center',
  },
  noImagesSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  // New styles for image upload functionality
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  addImageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addImageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.red,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    minWidth: 100,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  cancelDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  cancelDeleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  confirmDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.red,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  confirmDeleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.navy,
    marginBottom: 12,
    paddingLeft: 4,
  },
  selectedImageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  selectButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.navy,
  },
  uploadButton: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  selectedImagesContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  selectedImageWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Delete mode styles
  selectionCount: {
    fontSize: 14,
    color: COLORS.red,
    fontWeight: '600',
  },
  selectableImageWrapper: {
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  selectedForDeletionWrapper: {
    borderColor: COLORS.red,
    borderWidth: 3,
  },
  selectedModalImage: {
    opacity: 0.8,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
  },
  selectionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  existingImageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  selectionText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  selectedText: {
    color: COLORS.red,
    fontWeight: '600',
  },
});

export default AdminTurfCard;
