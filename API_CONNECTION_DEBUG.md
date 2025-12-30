# API Connection Debugging Guide

## Common Issues & Solutions

### Issue 1: Backend URL is Wrong

**Check:**
1. Verify your Render backend URL is correct
2. The URL should be: `https://your-app-name.onrender.com` (no trailing slash)
3. Test in browser: `https://your-backend-url.onrender.com/health`

**Fix:**
Update `src/config.ts`:
```typescript
export const API_BASE_URL = "https://your-actual-render-url.onrender.com";
```

---

### Issue 2: Backend is Sleeping (Render Free Tier)

**Symptom:**
- First request takes 30+ seconds
- Subsequent requests work fine
- Error: "Network request failed" or timeout

**Solution:**
- Wait 30 seconds for first request (Render spins up)
- Or upgrade to paid tier (no sleep)
- Or use a "ping" service to keep it awake

---

### Issue 3: CORS Issues

**Symptom:**
- Error: "CORS policy" or "Access-Control-Allow-Origin"
- Requests work in browser but not in app

**Check Backend:**
Your backend already has CORS configured:
```python
allow_origins=["*"]  # Allows all origins
```

**If still having issues:**
- Check backend logs in Render dashboard
- Verify CORS middleware is active
- Try adding explicit headers

---

### Issue 4: SSL/Certificate Issues

**Symptom:**
- Error: "Network request failed"
- Error: "SSL handshake failed"

**Solution:**
- Render provides SSL automatically
- If using custom domain, ensure SSL is configured
- Check if URL uses `https://` (not `http://`)

---

### Issue 5: API Endpoint Path Issues

**Check:**
- Backend endpoints should match frontend calls
- Example: Frontend calls `/products`, backend should have `/products` route
- Check if backend uses a prefix like `/api` (yours doesn't)

**Your Current Setup:**
- Frontend: `API_BASE_URL + "/products"`
- Backend: Should have route `/products`
- ✅ This should be correct

---

### Issue 6: Authentication Headers

**Symptom:**
- 401 errors
- "Authentication required"

**Check:**
- Token is being sent: Check `getAuthHeaders()` function
- Token format: Should be `Bearer <token>`
- Token is valid: Check if token expired

---

## Debugging Steps

### Step 1: Test Backend Directly

Open in browser:
```
https://your-backend-url.onrender.com/health
```

Should return: `{"status": "ok"}`

### Step 2: Test API Endpoint

Open in browser:
```
https://your-backend-url.onrender.com/products
```

Should return: JSON array or error message

### Step 3: Check Frontend Config

In your app, add this to test:
```typescript
import { testApiConnection } from "./utils/apiDebug";

// In a component or screen
const testConnection = async () => {
  const result = await testApiConnection();
  console.log("API Test Result:", result);
};
```

### Step 4: Check Network Logs

1. Open React Native debugger
2. Check Network tab
3. See actual requests being made
4. Check response status and headers

### Step 5: Check Backend Logs

1. Go to Render dashboard
2. Click on your web service
3. View "Logs" tab
4. See if requests are reaching backend

---

## Quick Fixes

### Fix 1: Update Backend URL

Make sure `src/config.ts` has the correct Render URL:

```typescript
// Get your actual Render URL from Render dashboard
export const API_BASE_URL = "https://your-actual-app-name.onrender.com";
```

### Fix 2: Add Error Logging

Temporarily add console logs to see what's happening:

```typescript
// In any API call
console.log("Calling:", `${API_BASE_URL}/products`);
console.log("Headers:", headers);

const response = await fetch(...);
console.log("Response status:", response.status);
console.log("Response ok:", response.ok);
```

### Fix 3: Test with curl/Postman

Test backend directly:
```bash
curl https://your-backend-url.onrender.com/health
curl https://your-backend-url.onrender.com/products
```

---

## Common Error Messages

### "Network request failed"
- **Cause:** Cannot reach server
- **Fix:** Check URL, check internet, wait for Render to wake up

### "CORS policy"
- **Cause:** Backend CORS not configured
- **Fix:** Already configured, but check backend logs

### "401 Unauthorized"
- **Cause:** Missing or invalid token
- **Fix:** Check authentication flow, verify token is saved

### "404 Not Found"
- **Cause:** Wrong endpoint path
- **Fix:** Check backend routes match frontend calls

### "500 Internal Server Error"
- **Cause:** Backend error
- **Fix:** Check backend logs in Render dashboard

---

## Testing Checklist

- [ ] Backend URL is correct in `src/config.ts`
- [ ] Backend is running (check Render dashboard)
- [ ] Backend `/health` endpoint works in browser
- [ ] Backend `/products` endpoint works in browser
- [ ] CORS is configured (already done)
- [ ] Frontend can make fetch requests (test with simple endpoint)
- [ ] Authentication tokens are being sent
- [ ] Network logs show requests being made
- [ ] Backend logs show requests being received

---

## Next Steps

1. **Verify Backend URL:** Check Render dashboard for actual URL
2. **Test in Browser:** Try endpoints directly
3. **Check Logs:** Both frontend (console) and backend (Render)
4. **Test Simple Endpoint:** Try `/health` first
5. **Add Debugging:** Use the `apiDebug.ts` utility

