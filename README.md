# Slooze Take-home Front-end (with simple Java backend)

This is a minimal Spring Boot application that implements the Commodities Management feature flow:
- Login (POST /auth/login) for Manager and Store Keeper (see seeded users)
- Role-based dashboard (Managers only)
- View/Add/Edit products (both roles)
- Light/Dark theme (stored in localStorage)
- Role-based menu & client-side route guards

Seeded users:
- manager@example.com / manager123  (MANAGER)
- keeper@example.com / keeper123    (STORE_KEEPER)

Build & run:
1. Import this Maven project into IntelliJ.
2. Run `mvn spring-boot:run` (or run Application.java).
3. Open http://localhost:8080 in your browser.

Notes:
- This example uses an in-memory store (no DB). Sessions are simple UUID tokens stored server-side.
- It's intentionally minimal to be easy to run and extend.
