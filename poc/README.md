# Fixly POC: database

Local MySQL for the walking skeleton (UI -> API -> MySQL -> API -> UI).
This folder covers the database layer only. The FastAPI backend and the React Native app come next.

## Prerequisites
- Docker Desktop (includes Docker Compose), running

## Start the database
1. Copy the example settings and choose your own passwords:
   `cp .env.example .env`
2. Start MySQL:
   `docker compose up -d`
3. Wait until the container is healthy (about 20-30 seconds the first time):
   `docker compose ps`

## Check that it works
Print the seeded message (enter the `MYSQL_PASSWORD` from your `.env` when asked):

    docker compose exec db mysql -u fixly_app -p fixly -e "SELECT id, message, created_at FROM poc_messages;"

Expected: one row reading `Hello from the MySQL database!`

Check the version:

    docker compose exec db mysql -u fixly_app -p -e "SELECT VERSION();"

## Demo evidence check (optional, rehearse first)
Change the message, then trigger the request in the app again to show the new value:

    docker compose exec db mysql -u fixly_app -p fixly -e "UPDATE poc_messages SET message='Updated live during the demo' WHERE id=1;"

Put it back before the next rehearsal:

    docker compose exec db mysql -u fixly_app -p fixly -e "UPDATE poc_messages SET message='Hello from the MySQL database!' WHERE id=1;"

## Reset to a clean database
This deletes all data and re-runs the scripts in `db/init/`:

    docker compose down -v
    docker compose up -d

## Notes
- Scripts in `db/init/` run only when the data volume is first created. Editing them later has no effect until you reset.
- The SQL files use the database name `fixly`. If you change `MYSQL_DATABASE` in `.env`, change it in both SQL files too.
- MySQL 9 uses `caching_sha2_password` login only. The FastAPI database driver must support it (PyMySQL needs the `cryptography` package; `mysql-connector-python` supports it directly).
- Passwords live only in `.env`, which is git-ignored.
