# Popup Image Backend Endpoints - Summary

## Required Backend Endpoints

### ✅ **1. Public Endpoint (No Auth Required)**
**GET** `/api/popup-image/active`
- **Purpose**: Frontend fetches the active popup image to display on homepage
- **Auth**: None (Public)
- **Returns**: Single active popup image object or null

---

### ✅ **2. Admin Endpoints (Auth Required)**

#### **GET** `/api/admin/popup-image`
- **Purpose**: Admin page fetches all popup images to show current image
- **Auth**: ✅ **ADMIN ONLY** (Session/JWT required)
- **Returns**: Array of all popup images

#### **POST** `/api/admin/popup-image`
- **Purpose**: Create/Upload new popup image
- **Auth**: ✅ **ADMIN ONLY** (Session/JWT required)
- **Request**: FormData with `image` file
- **Behavior**: 
  - If image exists, deactivate old one
  - Set new image as active
- **Returns**: Created image object

#### **PUT** `/api/admin/popup-image/:id`
- **Purpose**: Update existing popup image
- **Auth**: ✅ **ADMIN ONLY** (Session/JWT required)
- **Request**: FormData with optional `image` file
- **Returns**: Updated image object

#### **DELETE** `/api/admin/popup-image/:id`
- **Purpose**: Delete popup image
- **Auth**: ✅ **ADMIN ONLY** (Session/JWT required)
- **Returns**: Success message

---

## Summary Table

| Method | Endpoint | Auth | Purpose | Used By |
|--------|----------|------|---------|---------|
| GET | `/api/popup-image/active` | ❌ Public | Get active image | Home.jsx (Frontend) |
| GET | `/api/admin/popup-image` | ✅ Admin | Get all images | ChangePopupImage.jsx |
| POST | `/api/admin/popup-image` | ✅ Admin | Create/Upload | ChangePopupImage.jsx |
| PUT | `/api/admin/popup-image/:id` | ✅ Admin | Update | ChangePopupImage.jsx |
| DELETE | `/api/admin/popup-image/:id` | ✅ Admin | Delete | ChangePopupImage.jsx |

---

## Key Requirements

1. **Authentication**: All `/api/admin/popup-image/*` endpoints MUST require admin authentication
2. **Single Active Image**: Only one image can be `is_active = 1` at a time
3. **File Upload**: Use FormData for image uploads (POST/PUT)
4. **Image Storage**: Store in `uploads/popup/` directory
5. **File Validation**: 
   - Accept: jpg, jpeg, png, webp
   - Max size: 5MB recommended

---

## Database Table

Table name: `popup_image`

```sql
CREATE TABLE IF NOT EXISTS `popup_image` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `image` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Response Format

All endpoints should return JSON in this format:

**Success:**
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## Full Documentation

See `API_ENDPOINTS_POPUP_IMAGE.md` for complete endpoint documentation with examples.

