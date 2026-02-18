# Keywords Management API Endpoints

This document describes the backend API endpoints needed for the Keywords Management feature.

## Base URL
```
/api/admin/keywords
```

## Authentication
All endpoints (except GET for public use) require admin authentication via session cookies or JWT tokens.

---

## Endpoints

### 1. Create Keywords (Bulk)
**POST** `/api/admin/keywords`

**Description:** Add one or multiple keywords with redirect URLs.

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "keywords": [
    {
      "keyword": "real estate",
      "redirect_url": "https://example.com/properties"
    },
    {
      "keyword": "gurugram properties",
      "redirect_url": "/properties/gurugram"
    }
  ]
}
```

**Response (Success - 201 Created):**
```json
{
  "status": "success",
  "message": "Keywords added successfully",
  "data": {
    "keywords": [
      {
        "id": 1,
        "keyword": "real estate",
        "redirect_url": "https://example.com/properties",
        "clicks": 0,
        "is_active": 1,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      },
      {
        "id": 2,
        "keyword": "gurugram properties",
        "redirect_url": "/properties/gurugram",
        "clicks": 0,
        "is_active": 1,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "status": "error",
  "message": "Invalid keyword or redirect URL"
}
```

**Response (Error - 409 Conflict):**
```json
{
  "status": "error",
  "message": "Keyword already exists"
}
```

---

### 2. Get All Keywords
**GET** `/api/admin/keywords`

**Description:** Retrieve all keywords (with optional filtering).

**Authentication:** Required (Admin)

**Query Parameters (Optional):**
- `is_active` (boolean): Filter by active status (default: all)
- `search` (string): Search keywords by keyword text
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 50)

**Example:**
```
GET /api/admin/keywords?is_active=true&search=real&page=1&limit=20
```

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "keywords": [
      {
        "id": 1,
        "keyword": "real estate",
        "redirect_url": "https://example.com/properties",
        "clicks": 15,
        "is_active": 1,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

**Response (Empty - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "keywords": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

---

### 3. Get Single Keyword
**GET** `/api/admin/keywords/:id`

**Description:** Retrieve a single keyword by ID.

**Authentication:** Required (Admin)

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "keyword": {
      "id": 1,
      "keyword": "real estate",
      "redirect_url": "https://example.com/properties",
      "clicks": 15,
      "is_active": 1,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    }
  }
}
```

**Response (Error - 404 Not Found):**
```json
{
  "status": "error",
  "message": "Keyword not found"
}
```

---

### 4. Update Keyword
**PUT** `/api/admin/keywords/:id`

**Description:** Update an existing keyword.

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "keyword": "real estate updated",
  "redirect_url": "https://example.com/new-properties",
  "is_active": true
}
```

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "message": "Keyword updated successfully",
  "data": {
    "keyword": {
      "id": 1,
      "keyword": "real estate updated",
      "redirect_url": "https://example.com/new-properties",
      "clicks": 15,
      "is_active": 1,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T11:00:00Z"
    }
  }
}
```

**Response (Error - 404 Not Found):**
```json
{
  "status": "error",
  "message": "Keyword not found"
}
```

**Response (Error - 409 Conflict):**
```json
{
  "status": "error",
  "message": "Keyword already exists"
}
```

---

### 5. Delete Keyword
**DELETE** `/api/admin/keywords/:id`

**Description:** Delete a keyword by ID.

**Authentication:** Required (Admin)

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "message": "Keyword deleted successfully"
}
```

**Response (Error - 404 Not Found):**
```json
{
  "status": "error",
  "message": "Keyword not found"
}
```

---

### 6. Bulk Delete Keywords (Optional)
**DELETE** `/api/admin/keywords/bulk`

**Description:** Delete multiple keywords at once.

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "message": "3 keywords deleted successfully"
}
```

---

### 7. Toggle Keyword Status (Optional)
**PATCH** `/api/admin/keywords/:id/toggle`

**Description:** Toggle the active status of a keyword.

**Authentication:** Required (Admin)

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "message": "Keyword status updated",
  "data": {
    "keyword": {
      "id": 1,
      "keyword": "real estate",
      "redirect_url": "https://example.com/properties",
      "clicks": 15,
      "is_active": 0,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  }
}
```

---

## Public Endpoints

### 8. Get Public Keywords (for display)
**GET** `/api/admin/keywords?is_active=true`

**Description:** Get active keywords for public display (can be accessed without authentication for reading).

**Authentication:** Not required (Public read access)

**Query Parameters:**
- `is_active` (boolean): Filter by active status (default: all)
- `search` (string): Search keywords by keyword text (optional)

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "keywords": [
      {
        "id": 1,
        "keyword": "real estate",
        "redirect_url": "https://example.com/properties",
        "clicks": 15,
        "is_active": 1,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

---

### 9. Get Redirect URL by Keyword
**GET** `/api/keywords/redirect/:keyword`

**Description:** Get redirect URL for a keyword (public endpoint, increments click count).

**Authentication:** Not required (Public)

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "keyword": "real estate",
    "redirect_url": "https://example.com/properties"
  }
}
```

**Response (Error - 404 Not Found):**
```json
{
  "status": "error",
  "message": "Keyword not found"
}
```

**Note:** This endpoint should increment the `clicks` counter when called.

---

## Validation Rules

1. **Keyword:**
   - Required
   - String, max 255 characters
   - Must be unique
   - Case-insensitive matching recommended

2. **Redirect URL:**
   - Optional
   - String, max 500 characters
   - If provided, must be a valid URL (http://, https://) or relative path (starts with /)
   - Relative paths should be validated to prevent security issues
   - Can be null/empty for keywords without redirect functionality

3. **is_active:**
   - Boolean (0 or 1)
   - Default: 1 (active)

---

## Database Schema Reference

See `database/keywords.sql` for the complete table structure.

**Key Fields:**
- `id`: Primary key, auto-increment
- `keyword`: Unique keyword text
- `redirect_url`: URL to redirect to
- `clicks`: Counter for tracking usage
- `is_active`: Active/inactive status
- `created_at`: Timestamp
- `updated_at`: Timestamp

---

## Error Codes

- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate keyword
- `500 Internal Server Error`: Server error

---

## Implementation Notes

1. **Case Sensitivity:** Consider storing keywords in lowercase and comparing case-insensitively for better matching.

2. **URL Validation:** Validate redirect URLs to prevent:
   - XSS attacks
   - Open redirect vulnerabilities
   - Invalid URLs

3. **Click Tracking:** Increment clicks counter atomically to prevent race conditions.

4. **Pagination:** Implement pagination for large keyword lists to improve performance.

5. **Search:** Consider full-text search or LIKE queries for keyword search functionality.

6. **Caching:** Consider caching frequently accessed keywords for better performance.

7. **Rate Limiting:** Implement rate limiting on public redirect endpoint to prevent abuse.

