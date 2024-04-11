db-up:
	docker compose up -d

db-down:
	docker compose down

db-logs:
	docker compose logs -f

db-migrate:
	docker cp ./src/server/createdb.sql mecha_elian-db-1:/sql.sql && docker exec mecha_elian-db-1 psql -U admin -d 3W_cda -f /sql.sql