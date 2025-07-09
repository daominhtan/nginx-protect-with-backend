# Nginx Authentication System

A containerized authentication system using Nginx as a reverse proxy with authentication middleware and a Node.js backend.

## 🏗️ Architecture

```
Client → Nginx (Port 8080) → Backend (Port 8081/3000)
```

- **Nginx**: Reverse proxy with authentication middleware
- **Backend**: Node.js authentication service
- **Protected Routes**: Store pages requiring authentication

## 🚀 Features

- ✅ Token-based authentication using cookies
- ✅ Protected routes with automatic login redirect
- ✅ Multiple store pages (`/store1/`, `/store2/`, `/store3/`)
- ✅ Logout functionality on all protected pages
- ✅ Automatic redirect to original page after login
- ✅ 404 handling for non-existent pages
- ✅ Public routes without authentication

## 📁 Project Structure

```
nginx-auth/
├── docker-compose.yaml
├── backend/
│   ├── app.js              # Node.js authentication server
│   ├── Dockerfile
│   └── package.json
└── nginx/
    ├── default.conf        # Nginx configuration
    └── html/
        ├── login.html      # Login page
        ├── index.html      # Default page
        └── store{1,2,3}/
            └── index.html  # Protected store pages
```

## 🔧 Configuration

### Nginx Configuration (`nginx/default.conf`)

- **Authentication endpoint**: `/auth` (internal)
- **Protected routes**: `/store1/`, `/store2/`, `/store3/`
- **Public routes**: `/public/`
- **API routes**: `/api/` (proxied to backend)
- **Error handling**: 401 → login redirect, 404 → standard error page

### Backend API Endpoints

- `POST /api/login` - User authentication
- `GET /auth-check` - Token validation (internal)

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nginx-auth
   ```

2. **Start the services**
   ```bash
   docker compose up -d --build
   ```

3. **Access the application**
   - Main application: http://localhost:8080
   - Login page: http://localhost:8080/login
   - Protected stores: 
     - http://localhost:8080/store1/
     - http://localhost:8080/store2/
     - http://localhost:8080/store3/

### Default Credentials

Configure your backend with appropriate user credentials. The login form accepts:
- Username: `[configured in backend]`
- Password: `[configured in backend]`

## 🔐 Authentication Flow

1. **User accesses protected route** (e.g., `/store2/`)
2. **Nginx checks authentication** via `/auth` endpoint
3. **If not authenticated**: Redirect to `/login?redirect=original-url`
4. **User logs in**: Backend validates and sets `AuthToken` cookie
5. **Redirect to original page**: User is redirected back to requested page
6. **Access granted**: User can access protected content

## 📝 Usage Examples

### Accessing Protected Content

```bash
# Without authentication - redirects to login
curl http://localhost:8080/store1/

# With valid token cookie
curl -b "AuthToken=valid-token" http://localhost:8080/store1/
```

### Login API

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

### Logout

Click the "Logout" button on any store page, or manually:
```javascript
document.cookie = "AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
window.location.href = "/login";
```

## 🛠️ Development

### File Structure

- **Frontend**: Static HTML files in `nginx/html/`
- **Backend**: Node.js application in `backend/`
- **Configuration**: Nginx config in `nginx/default.conf`

### Making Changes

1. **Frontend changes**: Edit files in `nginx/html/` (no restart needed)
2. **Backend changes**: Modify `backend/app.js` and restart container
3. **Nginx config**: Edit `nginx/default.conf` and reload nginx

### Reload Configuration

```bash
# Reload nginx configuration
docker exec nginx-auth-nginx-1 nginx -s reload

# Restart backend service
docker-compose restart backend
```

## 🔍 Troubleshooting

### Common Issues

1. **Login page downloads instead of displaying**
   - Check Content-Type headers in nginx config
   - Verify login.html exists in correct location

2. **Authentication not working**
   - Check backend logs: `docker logs nginx-auth-backend-1`
   - Verify token is set in cookies
   - Check `/auth-check` endpoint response

3. **404 errors on protected routes**
   - Verify files exist in `nginx/html/store{X}/`
   - Check nginx location block configuration

4. **Port issues**
   - Application: http://localhost:8080
   - Backend API: http://localhost:8081 (direct access)

### Debug Commands

```bash
# Check container status
docker-compose ps

# View logs
docker logs nginx-auth-nginx-1
docker logs nginx-auth-backend-1

# Test authentication endpoint
curl -H "Authorization: your-token" http://localhost:8081/auth-check
```

## 📊 Security Considerations

- Tokens are stored in HTTP-only cookies (configure in backend)
- HTTPS should be used in production
- Token expiration is set to 1 hour by default
- Internal `/auth` endpoint is not accessible externally

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.