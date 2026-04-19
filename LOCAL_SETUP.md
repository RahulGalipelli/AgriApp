# Run everything locally (frontend + backend linked)

Use this when you want the mobile app to talk to your **local** AgriAppService backend (no cloud).

---

## 1. Backend (AgriAppService)

- **Location:** `AgriAppService` folder  
- **.env:** Should already exist with `DATABASE_URL` or `POSTGRES_*`, Twilio, etc.  
- **Start:**
  ```bash
  cd AgriAppService
  python -m venv venv
  venv\Scripts\activate          # Windows
  # source venv/bin/activate     # Mac/Linux
  pip install -r requirements.txt
  uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload
  ```
- Backend will be at: **http://YOUR_PC_IP:8003** (and http://localhost:8003 on the same machine).

---

## 2. Get your PC’s IP address

The phone/emulator must use your PC’s IP to reach the backend.

- **Windows:** Open CMD or PowerShell → run `ipconfig` → use the **IPv4 Address** of your active adapter (Wi‑Fi or Ethernet), e.g. `192.168.1.100`.
- **Mac/Linux:** Run `ifconfig` or `ip addr` and use the relevant IPv4 address.

Example: if your IP is `192.168.1.100`, the backend URL is `http://192.168.1.100:8003`.

---

## 3. Frontend (AgriApp) – point to local backend

**Option A – No .env (use `config.ts` only)**  
- Open `AgriApp/src/config.ts`.  
- Set `DEV_API_IP` to your PC’s IP (e.g. `"192.168.1.100"`).  
- Leave `DEV_API_PORT` as `"8003"`.  
- Save. The app will use `http://YOUR_IP:8003`.

**Option B – Use .env (recommended)**  
1. In the **AgriApp** folder, copy the example env file:
   ```bash
   cd AgriApp
   copy .env.example .env          # Windows
   # cp .env.example .env         # Mac/Linux
   ```
2. Edit **`.env`** and set your local backend URL (use your real IP):
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.100:8003
   ```
   Replace `192.168.1.100` with the IP from step 2.  
3. If you use **Option B**, the value in `.env` overrides `config.ts`. You can leave `DEV_API_IP` in `config.ts` as fallback when `.env` is not set.

---

## 4. Start the frontend (AgriApp)

- **Same Wi‑Fi (recommended for local):** Phone and PC on the same network.  
  ```bash
  cd AgriApp
  npm install
  npx expo start -c
  ```
  Then scan QR with Expo Go (no tunnel).  
- **Tunnel:** If you must use tunnel, the device cannot reach `http://YOUR_IP:8003`. Then either:
  - Don’t use tunnel and use same Wi‑Fi, or  
  - Point the app to the **cloud** backend by setting in `.env`:  
    `EXPO_PUBLIC_API_URL=https://agriapp-backend-88a1.onrender.com`  
    and run `npx expo start -c` (with tunnel if you want).

After changing `.env` or `config.ts`, always run with **`-c`** so Metro picks up the new URL:
```bash
npx expo start -c
```

---

## 5. Check that they’re linked

1. Backend: In the terminal where uvicorn runs, you should see “Uvicorn running on http://0.0.0.0:8003”.  
2. Frontend: In the app logs you should see: **`API Base URL: http://YOUR_IP:8003`** (your real IP, not Render).  
3. In the app: Log in with **9999999999** (admin skip). If products/cart load, the app is using your local backend.

---

## Quick checklist

| Step | What to do |
|------|------------|
| 1 | Backend: `.env` present, run `uvicorn ... --port 8003` |
| 2 | Get PC IP (e.g. `ipconfig`) |
| 3 | Frontend: set `EXPO_PUBLIC_API_URL=http://YOUR_IP:8003` in AgriApp `.env` **or** set `DEV_API_IP` in `config.ts` |
| 4 | Frontend: `npx expo start -c` (same Wi‑Fi, no tunnel for local backend) |
| 5 | Confirm log: `API Base URL: http://YOUR_IP:8003` |

If your IP changes (e.g. new Wi‑Fi), update `.env` or `config.ts` and run `npx expo start -c` again.

---

## Troubleshooting: "Network request timed out" or "Network request failed"

The app shows the right URL (e.g. `http://172.20.10.2:8003`) but requests never reach the backend. Usually the **PC is blocking** the phone.

### 1. Allow port 8003 in Windows Firewall (most common fix)

Run **PowerShell as Administrator**, then:

```powershell
New-NetFirewallRule -DisplayName "Agri Backend 8003" -Direction Inbound -LocalPort 8003 -Protocol TCP -Action Allow
```

Or do it in the UI: **Windows Security → Firewall & network protection → Advanced settings → Inbound Rules → New Rule → Port → TCP 8003 → Allow**.

### 2. Confirm backend is running and reachable

- On the **PC**, open a browser: **http://localhost:8003/docs**  
  - If the Swagger page loads, the backend is running.
- In the backend terminal you should see **"Uvicorn running on http://0.0.0.0:8003"** and **"Application startup complete"**.  
  - If you only see the reloader and "Starting AgriCure backend" but no "Application startup complete", wait a few seconds or check for a Python error in that terminal.

### 3. Same network and correct IP

- **Phone and PC** must be on the **same Wi‑Fi** (not guest network, not different VLAN).
- On the PC run **`ipconfig`** and use the **IPv4 address** of the adapter that’s on the same network as the phone (e.g. Wi‑Fi adapter).  
  - `172.20.10.x` is often used when the PC is sharing internet (e.g. hotspot). If the phone is connecting through that hotspot, the IP is correct; if the phone is on home Wi‑Fi and the PC is on the same Wi‑Fi, use the PC’s Wi‑Fi IPv4 (e.g. `192.168.1.x`).

### 4. After changing the firewall

- Restart the app (or reload in Expo Go).
- You should see requests in the **backend terminal** when you use the app (e.g. `GET /products`, `GET /cart`).
