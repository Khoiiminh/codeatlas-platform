# Infrastructure

Deployment and runtime infrastructure: `docker/`, `database/` (PostgreSQL migrations), `redis/`, `storage/` (R2), `deployment/`. Not imported by application code. Adapters in `packages/*` read their connection settings from configuration provided by the composition roots.
