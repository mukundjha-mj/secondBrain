# 🔐 Environment Configuration Guide

## Overview
अब backend URL को secure तरीके से environment variables में store किया गया है।

## Environment Variables

### Required Variables
```bash
# Database
DATABASE_URL=mongodb+srv://...

# JWT Secret
JWT_SECRET=your-jwt-secret

# Server URL (New)
SERVER_URL=https://secondbrain-1urp.onrender.com
```

## Configuration Files

### 1. `.env` (Local Development)
```bash
JWT_SECRET=mukundjha204@secret1234
DATABASE_URL=mongodb+srv://mukundjha204:sVbuyUP6wSOCsO0G@cluster0.srrhil7.mongodb.net/secondBrain
SERVER_URL=https://secondbrain-1urp.onrender.com
```

### 2. `.env.example` (Template)
```bash
JWT_SECRET=your-jwt-secret-here
DATABASE_URL=your-mongodb-connection-string-here
SERVER_URL=https://your-app-name.onrender.com
```

### 3. `config.ts` (Configuration Manager)
- ✅ Loads environment variables
- ✅ Validates required variables
- ✅ Exports SERVER_URL, JWT_SECRET, DATABASE_URL
- ✅ Fails gracefully if variables missing

## URL Priority System

### Production (Render)
1. **First Priority**: `RENDER_EXTERNAL_URL` (Render auto-provides)
2. **Second Priority**: `SERVER_URL` (from .env)
3. **Fallback**: localhost (development)

### Development
1. **Default**: localhost:3000
2. **Testing**: Uses SERVER_URL for remote testing

## Security Benefits

### ✅ Before vs After
```typescript
// ❌ Before (Hardcoded)
const serverUrl = 'https://secondbrain-1urp.onrender.com';

// ✅ After (Environment Variable)
const serverUrl = SERVER_URL;
```

### 🔐 Security Features
- ✅ No hardcoded URLs in source code
- ✅ Sensitive data in .env (gitignored)
- ✅ Separate config for dev/prod
- ✅ Environment validation on startup

## Deployment Notes

### Render Environment Variables
Set these in Render Dashboard:
```
SERVER_URL=https://secondbrain-1urp.onrender.com
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=your-production-mongodb-url
```

### Testing
```bash
# Test with environment variables
npm run test:keepalive

# Build with new config
npm run build
```
