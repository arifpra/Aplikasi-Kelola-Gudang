# Shared Folder Governance

## Purpose
`shared/` is the single source of truth for cross-application constants and schema-neutral definitions used by both frontend and backend.

This folder must contain only static, environment-independent definitions.

---

## Allowed Content
- `permissions.json`
- Enum-style JSON files (e.g. `docStatus.json`, `movementTypes.json`, role codes)
- Constants used by both frontend and backend
- Pure data files (JSON preferred)

---

## Not Allowed
- Express middleware
- Database logic
- Repository/service files
- React components
- Tailwind/theme tokens
- Environment-specific configuration
- Runtime logic

---

## Dependency Boundary Rule
- `shared/` must never import from `frontend-gudang/` or `gudang-erp/`.
- No application-level dependency is allowed inside `shared/`.
- `shared/` must remain framework-agnostic.

---

## Versioning Rule
- Any change in `shared/` must be backward compatible or coordinated between frontend and backend in the same delivery.
- New permission codes must be seeded automatically in backend RBAC seeds.

---

## JSON Convention
- Keys must be UPPER_SNAKE_CASE for enum-style definitions.
- Values should match keys unless explicitly justified.
- Avoid nested complex structures unless domain-driven.

---

## Growth Guideline
If `shared/` grows beyond simple constants:
- Consider converting it into a proper internal package.
- Keep the folder minimal and focused on cross-app data only.

---

## Example Structure
shared/
  permissions.json
  constants/
    movementTypes.json
    docStatus.json
  README.md

---

## Current Enforcement Note
At this time, `shared/` contains only JSON data and no runtime logic.