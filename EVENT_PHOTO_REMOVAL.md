# Event Photo Section Removal

## Changes Applied

Successfully removed the "Add Photo" section from the create new event form.

## Files Modified

### `app/(drawer)/events.tsx`

#### 1. Removed Imports
- Removed `Image` from React Native imports
- Removed `Camera` icon from lucide-react-native imports
- Removed `* as ImagePicker from 'expo-image-picker'` import

**Before:**
```typescript
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Image } from 'react-native';
import { Calendar, Search, MapPin, Clock, Plus, X, ChevronDown, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
```

**After:**
```typescript
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { Calendar, Search, MapPin, Clock, Plus, X, ChevronDown } from 'lucide-react-native';
```

#### 2. Removed Image Field from State
- Removed `image: ''` from the `newEvent` state object

**Before:**
```typescript
const [newEvent, setNewEvent] = useState({
  title: '', date: '', time: '', location: '', description: '', organizer: '', category: 'regular', image: ''
});
```

**After:**
```typescript
const [newEvent, setNewEvent] = useState({
  title: '', date: '', time: '', location: '', description: '', organizer: '', category: 'regular'
});
```

#### 3. Removed Image Field from Modal Reset
- Removed `image: ''` from the `handleCloseModal` function

**Before:**
```typescript
setNewEvent({ title: '', date: '', time: '', location: '', description: '', organizer: '', category: 'regular', image: '' });
```

**After:**
```typescript
setNewEvent({ title: '', date: '', time: '', location: '', description: '', organizer: '', category: 'regular' });
```

#### 4. Removed handleImageUpload Function
Completely removed the `handleImageUpload` async function that handled:
- Media library permission requests
- Image picker launch
- Image selection and editing
- Image URI storage

#### 5. Removed Photo Upload UI Section
Removed the entire photo upload section from the modal form:
- Event Photo label
- Photo upload button
- Camera icon placeholder
- "Add Photo" text
- Image preview functionality

**Removed Code:**
```tsx
{/* Photo Upload Section */}
<View style={styles.formGroup}>
  <Text style={styles.formLabel}>Event Photo</Text>
  <TouchableOpacity style={styles.photoUploadButton} onPress={handleImageUpload}>
    {newEvent.image ? (
      <Image source={{ uri: newEvent.image }} style={styles.uploadedEventImage} />
    ) : (
      <View style={styles.photoUploadPlaceholder}>
        <Camera size={32} color="#9CA3AF" />
        <Text style={styles.photoUploadText}>Add Photo</Text>
      </View>
    )}
  </TouchableOpacity>
</View>
```

#### 6. Removed Photo-Related Styles
Removed all styles related to photo upload:
- `photoUploadButton`
- `photoUploadPlaceholder`
- `photoUploadText`
- `uploadedEventImage`

**Removed Styles:**
```typescript
photoUploadButton: { width: '100%', height: 200, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', borderStyle: 'dashed', overflow: 'hidden', backgroundColor: '#F9FAFB' },
photoUploadPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
photoUploadText: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
uploadedEventImage: { width: '100%', height: '100%', resizeMode: 'cover' },
```

## Result

The create event form now starts directly with the "Event Title" field, without any photo upload section. The form is cleaner and simpler, focusing only on the essential event information:

1. Event Title
2. Date
3. Time (Start and End)
4. Location
5. Organizer
6. Category
7. Description

All photo-related functionality, imports, and UI elements have been completely removed from the events screen.