# ZipTrip – Production-Ready Todo Application (MPA)

A clean, interview-ready **Multi-Page Application (MPA)** built with:

- **Frontend**: React 18 + Vite (multi-page) + Tailwind CSS
- **Backend**: Node.js + Express — **MVC architecture** (Controllers / Services / Utils)
- **Database**: MongoDB + Mongoose

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB running locally (`mongod`) **or** a MongoDB Atlas connection string

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Create `backend/.env` (already provided, edit as needed):

```env
PORT=3001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/todoapp
CORS_ORIGIN=http://localhost:5173
```

> **MongoDB Atlas**: Replace `MONGO_URI` with your Atlas connection string:
> ```
> MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/todoapp
> ```

### 3. Run in development (two terminals)

```bash
# Terminal 1 – API server
cd backend
npm run dev        # → http://localhost:3001

# Terminal 2 – Frontend (Vite)
cd frontend
npm run dev        # → http://localhost:5173
```

The Vite dev server proxies `/api/*` to the Express backend automatically.

### 4. Production build

```bash
cd frontend && npm run build
cd ../backend && NODE_ENV=production npm start
```

---

## Project Structure

```
todo-app/
├── backend/
│   ├── controllers/
│   │   └── todoController.js     # HTTP layer – validate → call service → respond
│   ├── services/
│   │   └── todoService.js        # Business logic + all DB queries (Mongoose)
│   ├── models/
│   │   └── Todo.js               # Mongoose schema & model
│   ├── routes/
│   │   ├── index.js              # Central route aggregator (mounted at /api)
│   │   └── todos.js              # Declarative route → controller mappings
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized error + 404 handling
│   ├── utils/
│   │   ├── validators.js         # Pure validation helpers (title, priority, dueDate, tags)
│   │   └── apiResponse.js        # Consistent response shape builders
│   ├── .env                      # Environment variables (never committed)
│   ├── server.js                 # Express app entry + MongoDB connect
│   └── package.json
├── frontend/
│   ├── index.html                # MPA entry – Todo List page
│   ├── todo.html                 # MPA entry – Single Todo Detail page
│   ├── src/
│   │   ├── api.js                # Fetch client
│   │   ├── components/           # Shared UI (Layout, TodoCard, StatsBar)
│   │   ├── pages/
│   │   │   ├── ListPage.jsx      # Full list + filters + create
│   │   │   └── DetailPage.jsx    # Detail view + edit (reads ?id=)
│   │   └── styles/index.css      # Tailwind
│   ├── vite.config.js            # Multi-page rollup input
│   └── package.json
├── FEATURES.md                   # Complete feature documentation
└── README.md
```

---

## MVC Architecture

```
Request
  │
  ▼
routes/index.js          ← mounts all resource routers under /api
  │
  ▼
routes/todos.js          ← declarative: verb + path → controller fn
  │
  ▼
controllers/todoController.js   ← validate input, call service, send response
  │
  ▼
services/todoService.js  ← all business logic + MongoDB queries
  │
  ▼
models/Todo.js           ← Mongoose schema (single source of truth for shape)
```

**Utils** are stateless helpers imported wherever needed:
- `utils/validators.js` — pure functions, no side-effects, fully unit-testable
- `utils/apiResponse.js` — consistent `{ success, data, message, count }` envelope

---

## API Overview

| Method | Endpoint                | Description                      |
|--------|-------------------------|----------------------------------|
| GET    | `/api/health`           | Health check + DB status         |
| GET    | `/api/todos`            | List todos (supports filters)    |
| GET    | `/api/todos/stats`      | Aggregate stats                  |
| GET    | `/api/todos/:id`        | Get one todo                     |
| POST   | `/api/todos`            | Create todo                      |
| PUT    | `/api/todos/:id`        | Update todo (partial supported)  |
| PATCH  | `/api/todos/:id/toggle` | Toggle completed status          |
| DELETE | `/api/todos/:id`        | Delete todo                      |

### Query params for `GET /api/todos`

| Param       | Values                              |
|-------------|-------------------------------------|
| `completed` | `true` \| `false`                   |
| `priority`  | `low` \| `medium` \| `high`        |
| `search`    | free text (title, description, tags)|
| `sortBy`    | `createdAt` \| `dueDate` \| `priority` \| `title` |
| `order`     | `asc` \| `desc`                     |

### Todo Schema

| Field         | Type       | Notes                              |
|---------------|------------|------------------------------------|
| `id`          | `string`   | MongoDB ObjectId                   |
| `title`       | `string`   | Required, max 200 chars            |
| `description` | `string`   | Optional, default `''`             |
| `completed`   | `boolean`  | Default `false`                    |
| `priority`    | `string`   | `low` \| `medium` \| `high`       |
| `tags`        | `string[]` | Default `[]`                       |
| `createdAt`   | `string`   | ISO 8601, auto-managed             |
| `updatedAt`   | `string`   | ISO 8601, auto-managed             |

---

## Running Tests

```bash
cd backend
npm test
```

---

## Design Decisions

1. **MVC separation** – Routes are purely declarative; all logic lives in service or controller layers.
2. **MongoDB + Mongoose** – Schema validation at DB level; indexes on `completed`, `priority`, `createdAt`, and full-text fields.
3. **Pure validators** – `utils/validators.js` has zero deps and is trivial to unit-test in isolation.
4. **Consistent response shape** – `apiResponse.js` ensures every endpoint returns `{ success, data, message?, count? }`.
5. **Error handling** – Central middleware, structured errors with HTTP status codes.
6. **MPA architecture** – Two independent HTML entry points; no client-side router; detail page reads `?id=`.
7. **Security basics** – JSON body size limit, CORS origin allow-list, env-based secrets.

---

## License

MIT – free to use for interview / portfolio.
