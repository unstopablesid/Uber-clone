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

# Captain API Documentation

## Register Captain
Creates a new captain account in the system.

### Endpoint
```
POST /captains/register
```

### Request Body
```json
{
    "fullname": "string",      // Required
    "email": "string",         // Required
    "password": "string",      // Required
    "vehicle": {
        "color": "string",     // Required
        "plate": "string",     // Required
        "capacity": "string",  // Required
        "vehicleType": "string" // Required
    }
}
```

### Validation Rules
- **Fullname**: Must not be empty
- **Email**: Must not be empty
- **Password**: Must not be empty
- **Vehicle**:
  - Color: Must not be empty
  - Plate: Must not be empty
  - Capacity: Must not be empty
  - Vehicle Type: Must not be empty

### Success Response
**Status Code**: `201 Created`
```json
{
    "message": "Captain created successfully",
    "captain": {
        "fullname": "string",
        "email": "string",
        "vehicle": {
            "color": "string",
            "plate": "string",
            "capacity": "string",
            "vehicleType": "string"
        }
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
            "msg": "Fullname is required",
            "param": "fullname",
            "location": "body"
        },
        {
            "msg": "Email is required",
            "param": "email",
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
- Password is automatically hashed using bcrypt
- JWT token is generated upon successful registration
- Password is excluded from captain object in responses
- Email must be unique in the system

### Example Request
```bash
curl -X POST http://your-api-domain/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Smith",
    "email": "john.smith@example.com",
    "password": "securepassword123",
    "vehicle": {
        "color": "Black",
        "plate": "ABC123",
        "capacity": "4",
        "vehicleType": "Sedan"
    }
}'
```

### Notes
- The response includes a JWT token that should be used for authenticated requests
- Password is never returned in the response
- Vehicle information is required for captain registration
- All vehicle details must be provided during registration 

## Login Captain
Authenticates a captain and returns a JWT token.

### Endpoint
```
POST /captains/login
```

### Request Body
```json
{
    "email": "string",     // Required
    "password": "string"   // Required
}
```

### Validation Rules
- **Email**: Must not be empty
- **Password**: Must not be empty

### Success Response
**Status Code**: `200 OK`
```json
{
    "message": "Login successful",
    "captain": {
        "fullname": "string",
        "email": "string",
        "vehicle": {
            "color": "string",
            "plate": "string",
            "capacity": "string",
            "vehicleType": "string"
        }
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
            "msg": "Email is required",
            "param": "email",
            "location": "body"
        },
        {
            "msg": "Password is required",
            "param": "password",
            "location": "body"
        }
    ]
}
```

#### Invalid Credentials
**Status Code**: `401 Unauthorized`
```json
{
    "error": "Invalid email or password"
}
```

### Security Features
- Password is verified using bcrypt
- JWT token is generated upon successful login
- Password is excluded from captain object in responses
- Token expires after 24 hours

### Example Request
```bash
curl -X POST http://your-api-domain/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.smith@example.com",
    "password": "securepassword123"
}'
```

### Notes
- The response includes a JWT token that should be used for authenticated requests
- Password is never returned in the response
- Token should be included in the Authorization header for subsequent requests
- Token format: `Authorization: Bearer JWT_TOKEN` 

## Get Captain Profile
Retrieves the profile information of the authenticated captain.

### Endpoint
```
GET /captains/profile
```

### Headers
```
Authorization: Bearer JWT_TOKEN
```

### Success Response
**Status Code**: `200 OK`
```json
{
    "captain": {
        "fullname": "string",
        "email": "string",
        "vehicle": {
            "color": "string",
            "plate": "string",
            "capacity": "string",
            "vehicleType": "string"
        }
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
curl -X GET http://your-api-domain/captains/profile \
  -H "Authorization: Bearer your_jwt_token"
```

## Logout Captain
Invalidates the current JWT token, effectively logging out the captain.

### Endpoint
```
POST /captains/logout
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
curl -X POST http://your-api-domain/captains/logout \
  -H "Authorization: Bearer your_jwt_token"
```

### Notes
- After logout, the token will be invalidated and cannot be used for future requests
- A new login will be required to obtain a new valid token
- The logout endpoint uses POST method for better security practices 