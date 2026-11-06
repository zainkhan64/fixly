# Fixly POC test guide

This guide verifies that the **Test Fixly** button sends a request to FastAPI, FastAPI reads a message from MySQL, and the frontend displays the result.

## 1. Get the test version

Clone the [Fixly repository](https://github.com/zainkhan64/fixly), then check out the integration branch or commit supplied with the submission. It must contain `frontend/`, `backend/`, and `poc/`. The integrated `frontend/App.tsx` calls `/api/message` when the button is pressed.

Install Git, Docker Desktop with Docker Compose, and Node.js with npm. Node.js 24 and npm 11 were used on the original test machine. Open Docker Desktop before proceeding. For the iOS Simulator, install Xcode and an iOS simulator runtime. For physical iPhone testing, install a version of Expo Go compatible with the project's Expo SDK.

## 2. Configure and start the API and database

From the repository root:

```bash
cd poc
cp .env.example .env
```

Skip the copy command if `.env` already exists. For a fresh setup, open `poc/.env` and replace the two password placeholders with local test passwords. Keep the database name and app user from the example. Keep these settings local.

If testing on a physical iPhone, connect it and the development computer to the same Wi-Fi. Find the computer's Wi-Fi IPv4 address in its network settings. On macOS, see **System Settings → Wi-Fi → Details → TCP/IP**. Use that address everywhere this guide shows `192.168.1.50`. For Safari testing, append this line to `poc/.env`:

```dotenv
CORS_ORIGINS=http://localhost:8081,http://192.168.1.50:8081
```

These are the browser page addresses that FastAPI allows to read its response. Use the exact address shown in the browser, including the port.

From `poc/`, start both services and check the endpoint:

```bash
docker compose -f docker-compose.yml -f ../backend/compose.poc.yaml up --build -d
curl -i http://localhost:8000/api/message
```

Expect HTTP **200** and a JSON response like this on a fresh database:

```json
{"id":1,"message":"Hello from the MySQL database!"}
```

If using an existing database, use the returned message as the expected result for the frontend tests.

## 3. Start the frontend

Open a second terminal at the repository root and enter `frontend/`:

```bash
cd frontend
npm ci
```

For testing only on the same computer, the frontend defaults to `http://localhost:8000`. For phone testing, create `frontend/.env.local` beside `App.tsx` and use the development computer's actual IP:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.50:8000
```

This is the API address the frontend calls. A physical iPhone uses its own address when given `localhost`, so it needs the computer's Wi-Fi IP. Keep both local environment files out of Git.

Start Expo and leave the terminal open:

```bash
npx expo start --go --lan --port 8081
```

Use port 8081 for this guide. If Expo reports that it is busy, stop the other frontend server before retrying.

## 4. Run the checks

| Client | Open Fixly |
| --- | --- |
| Computer browser | Press **w** in Expo, then open `http://localhost:8081`. |
| iOS Simulator on Mac | Press **i** in Expo and open the app in the simulator. |
| iPhone with Expo Go | Scan the Expo QR code with the iPhone Camera and open it in Expo Go. |
| iPhone Safari | After starting the web version with **w**, open `http://192.168.1.50:8081` using the computer's actual IP. |

For each client:

1. Confirm the Fixly screen opens and displays **Press the button to test the app.**
2. Tap **Test Fixly**. The displayed text should match the `message` field from the API response.
3. Confirm the button becomes available again after the request. Tap it again to verify the request can be repeated.

Record the Git commit (`git rev-parse --short HEAD`), client or device, and pass or fail result for each check.

## If a check fails

- **Phone cannot open the page on port 8081.** Confirm Expo is still running, the web version has started, and both devices are on the same network. Try the same Wi-Fi IP URL in the computer's browser.
- **Page opens but the button fails.** Open `http://192.168.1.50:8000/api/message` directly on the phone using the actual IP. If JSON appears, confirm the frontend uses that API address and FastAPI allows the page's exact origin in `CORS_ORIGINS`. After editing `poc/.env`, rerun the Compose startup command. After editing `frontend/.env.local`, fully reload the app or restart Expo.
- **API returns 404 or 503.** A 404 with “POC message not found” means the seed row is missing. A 503 indicates a database configuration or connection problem. From `poc/`, inspect `docker compose -f docker-compose.yml -f ../backend/compose.poc.yaml logs backend db`.

To stop the test, press **Control+C** in the Expo terminal. From `poc/`, run `docker compose -f docker-compose.yml -f ../backend/compose.poc.yaml down` to stop the API and database while preserving the database volume.
