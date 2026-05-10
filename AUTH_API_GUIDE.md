# Authentication API Documentation

## 1. Register API

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "userName": "string",
  "email": "string",
  "name": "string",
  "password": "string"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "data": {
    "token": "string",
    "refreshToken": "string",
    "user": {
      "email": "string",
      "name": "string"
    }
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "john_doe",
    "email": "john@example.com",
    "name": "John Doe",
    "password": "password123"
  }'
```

---

## 2. Login API

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "userName": "string",
  "password": "string",
  "rememberMe": true
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "data": {
    "token": "string",
    "refreshToken": "string",
    "user": {
      "email": "string",
      "name": "string"
    }
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "john_doe",
    "password": "password123",
    "rememberMe": true
  }'
```

---

## 3. Refresh Token API

**Endpoint:** `POST /api/v1/auth/refresh-token`

**Query Parameters:**
- `token` (string, required) - The refresh token

**Response (200 OK):**
```json
{
  "message": "Token refreshed successfully",
  "data": {
    "token": "string",
    "refreshToken": "string",
    "user": {
      "email": "string",
      "name": "string"
    }
  }
}
```

**Example cURL:**
```bash
curl -X POST "http://localhost:5000/api/v1/auth/refresh-token?token=YOUR_REFRESH_TOKEN"
```

---

## Testing Steps

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Register a new user:**
   - Use the register endpoint to create a new user
   - You'll receive tokens immediately upon registration

3. **Test Login:**
   - Use the login endpoint with userName and password
   - Save the tokens from the response

4. **Test Refresh Token:**
   - Use the refreshToken from login response
   - Get new access and refresh tokens

## Environment Variables

Make sure these are set in your `.env` file:
```
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
```
