# 📸 How to Add Real Photos to Posts

This guide shows you how to add real photos to your Facebook-style posts in the Local Connect feature.

---

## 🎯 Quick Start

Currently, all posts show placeholder emoji 📷 because the `photos` arrays are empty. Here's how to add real photos:

---

## Method 1: Add Static Local Images (Easiest)

### Step 1: Add Images to Your Project

Create a folder for neighbor photos:
```
assets/
  images/
    neighbors/
      neighbor1_photo1.jpg
      neighbor1_photo2.jpg
      neighbor2_photo1.jpg
      ...
```

### Step 2: Update Neighbor Data

Open `app/(drawer)/(tabs)/local-connect.tsx` and find the neighbors array (around line 100-130).

**Before:**
```typescript
{
  id: '1',
  name: 'Dr. Rajesh Kumar',
  profession: 'Doctor',
  specialization: 'Cardiologist - Heart Specialist',
  flatNumber: 'A-101',
  rating: 4.8,
  availability: 'Available',
  isOnline: true,
  photos: [],  // ← Empty array
  likes: 45,
  postTime: '2h ago',
}
```

**After:**
```typescript
{
  id: '1',
  name: 'Dr. Rajesh Kumar',
  profession: 'Doctor',
  specialization: 'Cardiologist - Heart Specialist',
  flatNumber: 'A-101',
  rating: 4.8,
  availability: 'Available',
  isOnline: true,
  photos: [
    require('../../../assets/images/neighbors/neighbor1_photo1.jpg'),
    require('../../../assets/images/neighbors/neighbor1_photo2.jpg'),
    require('../../../assets/images/neighbors/neighbor1_photo3.jpg'),
  ],  // ← Add up to 5 photos
  likes: 45,
  postTime: '2h ago',
}
```

### Step 3: Update Photo Rendering

Find the `renderPhotoGallery` function (around line 348) and update the placeholder rendering:

**Before:**
```typescript
<View style={[styles.photoPlaceholder, styles.singlePhoto]}>
  <Text style={styles.photoPlaceholderText}>📷</Text>
</View>
```

**After:**
```typescript
<Image 
  source={photos[0]} 
  style={styles.singlePhoto}
  resizeMode="cover"
/>
```

Do this for all photo layouts (single, two, three, four, five photos).

---

## Method 2: Use Remote URLs (For Production)

### Step 1: Update Neighbor Data with URLs

```typescript
{
  id: '1',
  name: 'Dr. Rajesh Kumar',
  profession: 'Doctor',
  specialization: 'Cardiologist - Heart Specialist',
  flatNumber: 'A-101',
  rating: 4.8,
  availability: 'Available',
  isOnline: true,
  photos: [
    'https://your-cdn.com/neighbors/dr-rajesh-1.jpg',
    'https://your-cdn.com/neighbors/dr-rajesh-2.jpg',
    'https://your-cdn.com/neighbors/dr-rajesh-3.jpg',
  ],
  likes: 45,
  postTime: '2h ago',
}
```

### Step 2: Update Photo Rendering

```typescript
<Image 
  source={{ uri: photos[0] }} 
  style={styles.singlePhoto}
  resizeMode="cover"
/>
```

---

## Method 3: Implement Image Picker (Most Advanced)

This allows users to select photos from their device gallery or camera.

### Step 1: Install Expo Image Picker

```powershell
npx expo install expo-image-picker
```

### Step 2: Add Import

At the top of `local-connect.tsx`:
```typescript
import * as ImagePicker from 'expo-image-picker';
```

### Step 3: Create Image Picker Function

Add this function to your component:

```typescript
const pickImages = async (neighborId: string) => {
  // Request permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'We need camera roll permissions to select photos.');
    return;
  }

  // Launch image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    selectionLimit: 5,
    quality: 0.8,
    aspect: [4, 3],
  });

  if (!result.canceled) {
    // Get selected image URIs
    const selectedPhotos = result.assets.map(asset => asset.uri);
    
    // Update neighbor's photos
    // TODO: Update state or send to backend
    console.log('Selected photos:', selectedPhotos);
  }
};
```

### Step 4: Add "Add Photos" Button

Add a button to the post header:

```typescript
<TouchableOpacity 
  style={styles.addPhotosButton}
  onPress={() => pickImages(neighbor.id)}
>
  <Text style={styles.addPhotosText}>+ Add Photos</Text>
</TouchableOpacity>
```

### Step 5: Handle Camera

To take photos with camera:

```typescript
const takePhoto = async (neighborId: string) => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'We need camera permissions to take photos.');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    aspect: [4, 3],
  });

  if (!result.canceled) {
    const photoUri = result.assets[0].uri;
    // TODO: Add photo to neighbor's photos
    console.log('Photo taken:', photoUri);
  }
};
```

---

## 📝 Complete Example: Update renderPhotoGallery

Here's the complete updated function with real image support:

```typescript
const renderPhotoGallery = (photos: string[]) => {
  if (!photos || photos.length === 0) return null;

  const renderImage = (photo: string, style: any, key: string) => {
    // Check if it's a local require or remote URL
    const isRemote = typeof photo === 'string' && photo.startsWith('http');
    
    return (
      <Image
        key={key}
        source={isRemote ? { uri: photo } : photo}
        style={[styles.photoPlaceholder, style]}
        resizeMode="cover"
      />
    );
  };

  // 1 Photo - Full width
  if (photos.length === 1) {
    return (
      <View style={styles.photoGallery}>
        {renderImage(photos[0], styles.singlePhoto, 'photo-0')}
      </View>
    );
  }

  // 2 Photos - Side by side
  if (photos.length === 2) {
    return (
      <View style={styles.photoGallery}>
        <View style={styles.twoPhotosRow}>
          {renderImage(photos[0], styles.twoPhotosItem, 'photo-0')}
          {renderImage(photos[1], styles.twoPhotosItem, 'photo-1')}
        </View>
      </View>
    );
  }

  // 3 Photos - One large, two small
  if (photos.length === 3) {
    return (
      <View style={styles.photoGallery}>
        <View style={styles.threePhotosLayout}>
          {renderImage(photos[0], styles.threePhotosLarge, 'photo-0')}
          <View style={styles.threePhotosRight}>
            {renderImage(photos[1], styles.threePhotosSmall, 'photo-1')}
            {renderImage(photos[2], styles.threePhotosSmall, 'photo-2')}
          </View>
        </View>
      </View>
    );
  }

  // 4 Photos - 2x2 grid
  if (photos.length === 4) {
    return (
      <View style={styles.photoGallery}>
        <View style={styles.fourPhotosGrid}>
          {photos.map((photo, index) => 
            renderImage(photo, styles.fourPhotosItem, `photo-${index}`)
          )}
        </View>
      </View>
    );
  }

  // 5 Photos - 2 on top, 3 on bottom
  if (photos.length === 5) {
    return (
      <View style={styles.photoGallery}>
        <View style={styles.fivePhotosLayout}>
          <View style={styles.fivePhotosTopRow}>
            {renderImage(photos[0], styles.fivePhotosTopItem, 'photo-0')}
            {renderImage(photos[1], styles.fivePhotosTopItem, 'photo-1')}
          </View>
          <View style={styles.fivePhotosBottomRow}>
            {renderImage(photos[2], styles.fivePhotosBottomItem, 'photo-2')}
            {renderImage(photos[3], styles.fivePhotosBottomItem, 'photo-3')}
            {renderImage(photos[4], styles.fivePhotosBottomItem, 'photo-4')}
          </View>
        </View>
      </View>
    );
  }

  return null;
};
```

---

## 🎨 Photo Layout Examples

### 1 Photo Layout
```
┌─────────────────────────────────┐
│                                  │
│                                  │
│         [Full Photo]             │
│                                  │
│                                  │
└─────────────────────────────────┘
Width: 100%
Height: 300px
```

### 2 Photos Layout
```
┌─────────────────────────────────┐
│                                  │
│  [Photo 1]  │  [Photo 2]        │
│             │                   │
│             │                   │
└─────────────────────────────────┘
Width: 50% each
Height: 250px
```

### 3 Photos Layout
```
┌─────────────────────────────────┐
│                 │  [Photo 2]     │
│                 │                │
│  [Photo 1]      ├────────────    │
│                 │  [Photo 3]     │
│                 │                │
└─────────────────────────────────┘
Large: 66.66% width, 300px height
Small: 33.34% width, 150px height each
```

### 4 Photos Layout
```
┌─────────────────────────────────┐
│  [Photo 1]  │  [Photo 2]        │
│             │                   │
├─────────────┼───────────────────┤
│  [Photo 3]  │  [Photo 4]        │
│             │                   │
└─────────────────────────────────┘
Width: 50% each
Height: 200px each
```

### 5 Photos Layout
```
┌─────────────────────────────────┐
│  [Photo 1]  │  [Photo 2]        │
│             │                   │
├─────────────┴───────────────────┤
│ [Photo 3] [Photo 4] [Photo 5]   │
└─────────────────────────────────┘
Top: 50% width, 200px height each
Bottom: 33.33% width, 150px height each
```

---

## 🔧 Backend Integration (Optional)

If you want to save photos to a backend:

### Step 1: Create Upload Function

```typescript
const uploadPhotos = async (neighborId: string, photos: string[]) => {
  const formData = new FormData();
  
  photos.forEach((photoUri, index) => {
    formData.append('photos', {
      uri: photoUri,
      type: 'image/jpeg',
      name: `photo_${index}.jpg`,
    } as any);
  });

  try {
    const response = await fetch(`https://your-api.com/neighbors/${neighborId}/photos`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();
    return data.photoUrls; // Array of uploaded photo URLs
  } catch (error) {
    console.error('Upload failed:', error);
    Alert.alert('Upload Failed', 'Could not upload photos. Please try again.');
    return null;
  }
};
```

### Step 2: Update State After Upload

```typescript
const handlePhotoUpload = async (neighborId: string, localPhotos: string[]) => {
  // Show loading indicator
  setIsUploading(true);

  // Upload photos
  const uploadedUrls = await uploadPhotos(neighborId, localPhotos);

  if (uploadedUrls) {
    // Update neighbor's photos in state
    setNeighbors(prev => prev.map(neighbor => 
      neighbor.id === neighborId 
        ? { ...neighbor, photos: [...neighbor.photos, ...uploadedUrls] }
        : neighbor
    ));

    Alert.alert('Success', 'Photos uploaded successfully!');
  }

  setIsUploading(false);
};
```

---

## 🎯 Best Practices

### Image Optimization
1. **Compress images** before uploading (quality: 0.8)
2. **Resize large images** to max 1920x1080
3. **Use WebP format** for better compression (if supported)
4. **Lazy load images** for better performance

### User Experience
1. **Show loading indicators** while uploading
2. **Allow photo deletion** after upload
3. **Show upload progress** for large files
4. **Cache images** for offline viewing
5. **Validate file size** (max 5MB per photo)

### Security
1. **Validate file types** (only images)
2. **Scan for malware** on backend
3. **Use secure URLs** (HTTPS)
4. **Implement access control** (who can see photos)
5. **Add watermarks** if needed

---

## 🐛 Troubleshooting

### Issue: Images not displaying
**Solution**: Check that image paths are correct and files exist

### Issue: "Cannot read property 'uri' of undefined"
**Solution**: Verify ImagePicker result structure: `result.assets[0].uri`

### Issue: Images are too large
**Solution**: Add compression: `quality: 0.8` in ImagePicker options

### Issue: Permission denied
**Solution**: Request permissions before launching picker

### Issue: Images load slowly
**Solution**: Implement image caching with `react-native-fast-image`

---

## 📚 Additional Resources

### Libraries
- **expo-image-picker**: https://docs.expo.dev/versions/latest/sdk/imagepicker/
- **react-native-fast-image**: https://github.com/DylanVann/react-native-fast-image
- **react-native-image-crop-picker**: https://github.com/ivpusic/react-native-image-crop-picker

### Tutorials
- Expo Image Picker Guide: https://docs.expo.dev/tutorial/image-picker/
- React Native Image Upload: https://reactnative.dev/docs/images

---

## ✅ Summary

To add photos to your posts:

1. **Easiest**: Add local images with `require()`
2. **Production**: Use remote URLs from your CDN
3. **Advanced**: Implement image picker for user uploads

The photo gallery system is already built and ready - just add the image sources!

---

*Last Updated: January 2025*  
*Guide Version: 1.0*