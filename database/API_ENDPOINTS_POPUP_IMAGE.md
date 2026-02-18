# Popup Image Management API Endpoints

This document describes the backend API endpoints needed for the Popup Image Management feature.

## Base URL
```
/api/admin/popup-image
```

## Authentication
All endpoints (except GET for public use) require admin authentication via session cookies or JWT tokens.

---

## Endpoints

### 1. Get Active Popup Image (Public)
**GET** `/api/popup-image/active`

**Description:** Retrieve the currently active popup image for the homepage contact form.

**Authentication:** Not required (Public endpoint)

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "image": "uploads/popup/contact.jpg",
    "is_active": 1,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

**Response (No Image Found - 200 OK):**
```json
{
  "status": "success",
  "data": null,
  "message": "No active popup image found"
}
```

---

### 2. Get All Popup Images (Admin)
**GET** `/api/admin/popup-image`

**Description:** Retrieve all popup images (for admin management).

**Authentication:** Required (Admin)

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "images": [
      {
        "id": 1,
        "image": "uploads/popup/contact.jpg",
        "is_active": 1,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

---

### 3. Create/Update Popup Image (Admin)
**POST** `/api/admin/popup-image`

**Description:** Create a new popup image. If an active image already exists, it will be deactivated and the new one will be set as active.

**Authentication:** Required (Admin)

**Request Body (FormData):**
```
image: [File] (required) - Image file to upload
is_active: 1 or 0 (optional, default: 1)
```

**Response (Success - 201 Created):**
```json
{
  "status": "success",
  "message": "Popup image uploaded successfully",
  "data": {
    "id": 1,
    "image": "uploads/popup/contact-1234567890.jpg",
    "is_active": 1,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "status": "error",
  "message": "Image file is required"
}
```

---

### 4. Update Popup Image (Admin)
**PUT** `/api/admin/popup-image/:id`

**Description:** Update an existing popup image.

**Authentication:** Required (Admin)

**Request Body (FormData):**
```
image: [File] (optional) - New image file to upload
is_active: 1 or 0 (optional)
```

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "message": "Popup image updated successfully",
  "data": {
    "id": 1,
    "image": "uploads/popup/contact-updated.jpg",
    "is_active": 1,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T11:00:00Z"
  }
}
```

**Response (Error - 404 Not Found):**
```json
{
  "status": "error",
  "message": "Popup image not found"
}
```

---

### 5. Delete Popup Image (Admin)
**DELETE** `/api/admin/popup-image/:id`

**Description:** Delete a popup image (hard delete).

**Authentication:** Required (Admin)

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "message": "Popup image deleted successfully"
}
```

**Response (Error - 404 Not Found):**
```json
{
  "status": "error",
  "message": "Popup image not found"
}
```

---

## Backend Implementation Notes

1. **Image Storage**: Store uploaded images in a dedicated directory (e.g., `uploads/popup/`)
2. **File Validation**: Validate image file types (jpg, jpeg, png, webp) and file size (recommended max: 5MB)
3. **Single Active Image**: When a new image is set as active, automatically deactivate all other images
4. **Image Resolution**: Recommended minimum resolution: 800x600px for optimal display
5. **Error Handling**: Return appropriate HTTP status codes and error messages
6. **File Naming**: Use unique filenames (timestamp or UUID) to avoid conflicts

---

## Example Backend Implementation (Node.js/Express)

```javascript
// GET /api/popup-image/active (Public)
router.get('/popup-image/active', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM popup_image WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1'
    );
    
    if (rows.length === 0) {
      return res.json({ status: 'success', data: null, message: 'No active popup image found' });
    }
    
    res.json({ status: 'success', data: rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/admin/popup-image (Admin)
router.post('/admin/popup-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Image file is required' });
    }
    
    // Deactivate all existing images
    await db.query('UPDATE popup_image SET is_active = 0');
    
    // Insert new image
    const imagePath = `/uploads/popup/${req.file.filename}`;
    const [result] = await db.query(
      'INSERT INTO popup_image (image, is_active) VALUES (?, 1)',
      [imagePath]
    );
    
    const [rows] = await db.query('SELECT * FROM popup_image WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      status: 'success',
      message: 'Popup image uploaded successfully',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
```

---

## Frontend Integration

The frontend should:
1. Fetch the active popup image on page load
2. Display the image in the contact popup form
3. Fallback to default image if no active image is found
4. Handle loading and error states gracefully

