# User Registration API Documentation

## Register User
Creates a new user account in the system.

### Endpoint
```
POST /users/register
```

### Request Body
```json
{
    "fullname": {
        "firstname": "string",  // Required, min 6 chars, max 255 chars
        "lastname": "string"    // Optional, min 6 chars, max 255 chars
    },
    "email": "string",         // Required, valid email format, min 6 chars, max 255 chars
    "password": "string"       // Required, min 6 chars
}
```

### Validation Rules
- **Email**: Must be a valid email format
- **Password**: Minimum 6 characters
- **Fullname**: Minimum 3 characters
  - Firstname: Required, 6-255 characters
  - Lastname: Optional, 6-255 characters if provided

### Success Response
**Status Code**: `201 Created`

```json
{
    "message": "User created successfully",
    "user": {
        "fullname": {
            "firstname": "string",
            "lastname": "string"
        },
        "email": "string",
        "socketID": "string"
    },
    "token": "JWT_TOKEN"
}
```

### Error Responses

#### Validation Error
**Status Code**: `400 Bad Request`
```json
{
    "errors": [
        {
            "msg": "Invalid email",
            "param": "email",
            "location": "body"
        },
        {
            "msg": "Password must be at least 6 characters long",
            "param": "password",
            "location": "body"
        }
    ]
}
```

#### Missing Required Fields
**Status Code**: `400 Bad Request`
```json
{
    "error": "All fields are required"
}
```

### Security Features
- Password is automatically hashed using bcrypt (10 rounds)
- JWT token is generated upon successful registration
- Password is excluded from user object in responses
- Email must be unique in the system

### Example Request
```bash
curl -X POST http://your-api-domain/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
        "firstname": "John",
        "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securepassword123"
}'
```

### Notes
- The response includes a JWT token that should be used for authenticated requests
- Password is never returned in the response
- SocketID is required for real-time communication features
- All timestamps are in ISO 8601 format 

## Get User Profile
Retrieves the profile information of the authenticated user.

### Endpoint
```
GET /users/profile
```

### Headers
```
Authorization: Bearer JWT_TOKEN
```

### Success Response
**Status Code**: `200 OK`
```json
{
    "user": {
        "fullname": {
            "firstname": "string",
            "lastname": "string"
        },
        "email": "string",
        "socketID": "string"
    }
}
```

### Error Responses

#### Unauthorized
**Status Code**: `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided."
}
```

#### Invalid Token
**Status Code**: `401 Unauthorized`
```json
{
    "error": "Invalid token"
}
```

### Example Request
```bash
curl -X GET http://your-api-domain/users/profile \
  -H "Authorization: Bearer your_jwt_token"
```

## Logout User
Invalidates the current JWT token, effectively logging out the user.

### Endpoint
```
GET /users/logout
```

### Headers
```
Authorization: Bearer JWT_TOKEN
```

### Success Response
**Status Code**: `200 OK`
```json
{
    "message": "Successfully logged out"
}
```

### Error Responses

#### Unauthorized
**Status Code**: `401 Unauthorized`
```json
{
    "error": "Access denied. No token provided."
}
```

#### Invalid Token
**Status Code**: `401 Unauthorized`
```json
{
    "error": "Invalid token"
}
```

### Security Features
- The JWT token is added to a blacklist
- Blacklisted tokens automatically expire after 24 hours
- Subsequent requests with the blacklisted token will be rejected

### Example Request
```bash
curl -X GET http://your-api-domain/users/logout \
  -H "Authorization: Bearer your_jwt_token"
```

### Notes
- After logout, the token will be invalidated and cannot be used for future requests
- A new login will be required to obtain a new valid token 