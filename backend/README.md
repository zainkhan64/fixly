# Fixly POC backend — Anthony Awad

One real read: React Native UI → FastAPI → MySQL → JSON → UI.
This is the walking skeleton, not the complete Fixly application.

## Team integration contract

- Jordan: MySQL setup/schema/seed in PR #25 (feat/poc-mysql-database).
- Anthony: this FastAPI backend.
- Paratva: React Native client/button, loading state and error display.
- GET /api/message reads id=1 from fixly.poc_messages (columns id, message).
- Expected seed: {"id":1,"message":"Hello from the MySQL database!"}
- 404 means missing seed row; 503 means database/configuration unavailable.
- GET /health checks API liveness only, not MySQL.
- Database credentials stay out of Git and the frontend.

## Docker Compose startup (recommended)

Requires Docker Desktop running AND Jordan's PR #25 files present locally.
Have PR #25 reviewed/merged through the team workflow, then merge latest
origin/main into this backend branch. Until then this branch has no poc/ folder.

From the repository root:

```bash
cd poc
cp .env.example .env
```

Do not overwrite an existing .env. Edit poc/.env and choose local
MYSQL_ROOT_PASSWORD and MYSQL_PASSWORD. Keep MYSQL_DATABASE=fixly and
MYSQL_USER=fixly_app unless coordinated with Jordan. Never commit .env.

```bash
docker compose -f docker-compose.yml -f ../backend/compose.poc.yaml up --build -d
docker compose -f docker-compose.yml -f ../backend/compose.poc.yaml ps
curl -i http://localhost:8000/health
curl -i http://localhost:8000/api/message
```

Open http://localhost:8000/docs to try the endpoint interactively.
Inspect backend errors:

```bash
docker compose -f docker-compose.yml -f ../backend/compose.poc.yaml logs backend
```

Stop without deleting database data:

```bash
docker compose -f docker-compose.yml -f ../backend/compose.poc.yaml down
```

The overlay uses db:3306 and poc/.env credentials automatically; it does not
use backend/.env. Build paths resolve relative to the first Compose file (poc/).

## Direct Python startup on macOS (alternative)

Requires Python 3.12 and Jordan's MySQL running with its port published.
Do not also run the Compose backend on port 8000.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

Edit backend/.env to match Jordan's database/user/password. For MySQL on the
same computer use DB_HOST=127.0.0.1 and DB_PORT equal to its published MYSQL_PORT.
For another computer use its reachable host. Never commit .env.

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Frontend connection

Paratva calls the endpoint from the button handler:

```typescript
const response = await fetch(API_BASE_URL + '/api/message');
if (!response.ok) throw new Error('API error: ' + response.status);
const data = await response.json();
setMessage(data.message);
```

API_BASE_URL:
- iOS simulator/browser on backend computer: http://localhost:8000
- Android Studio emulator on backend computer: http://10.0.2.2:8000
- Phone/another computer: http://BACKEND_COMPUTER_LAN_IP:8000

Separate devices need a reachable shared network and firewall permission for
port 8000. localhost means the device making the request.
For a web frontend set CORS_ORIGINS to its exact origin including port.
Use comma-separated origins if needed. For Compose add it to poc/.env;
for direct Python use backend/.env. Restart/recreate backend after changes.
Native mobile HTTP permissions may also need Paratva's development configuration.

## Verification still to complete

These are checks to perform, not recorded passing results:
1. /health returns 200.
2. /api/message returns 200 and Jordan's seeded message.
3. Real frontend button displays that message.
4. Jordan changes the MySQL message; next button press displays the new value.
5. Stop db: endpoint returns 503 and frontend shows an error; restart db.
6. Second teammate repeats startup from a clean clone.
Record commit, device, versions, tester, actual results and fixes.

Dependencies are initially unpinned. After successful integration, record and
pin tested Python/package/image versions for rehearsal.
No live API/database/frontend test was executed while adding these files.
