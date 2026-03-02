---
inclusion: fileMatch
fileMatchPattern: '**/api/**/*,**/routes/**/*,**/controllers/**/*'
---

# API Standards

## RESTful API Design

### Endpoint Naming
- Use nouns, not verbs: `/users` not `/getUsers`
- Use plural nouns: `/users` not `/user`
- Use kebab-case: `/user-profiles`
- Nested resources: `/users/:id/posts`

### HTTP Methods
- `GET` - Retrieve resources (idempotent)
- `POST` - Create new resources
- `PUT` - Update entire resource (idempotent)
- `PATCH` - Partial update
- `DELETE` - Remove resource (idempotent)

### Status Codes
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server errors

### Request/Response Format
```typescript
// Success Response
{
  "data": {
    "id": "123",
    "name": "John Doe"
  },
  "meta": {
    "timestamp": "2026-03-02T00:00:00Z",
    "version": "1.0"
  }
}

// Error Response
{
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Invalid email format",
      "field": "email"
    }
  ]
}
```

### Pagination
```typescript
// Request
GET /api/users?page=2&limit=20

// Response
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Versioning
- URL versioning: `/api/v1/users`

### Authentication
- Use JWT tokens in Authorization header
- Format: `Authorization: Bearer <token>`
