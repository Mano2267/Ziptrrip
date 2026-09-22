# 📡 REST API Documentation

The ZipTrip Todo API is built with **Node.js, Express, and MongoDB (via Mongoose)**.

Base URL: `http://localhost:3001/api`

---

## Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health, uptime, and database connection status |
| `GET` | `/todos` | Fetch all todos (supports filters & search; default sorted by newest) |
| `GET` | `/todos/stats` | Aggregated statistics (total, completed, active, priority breakdown) |
| `GET` | `/todos/:id` | Fetch a single todo by MongoDB ObjectId |
| `POST` | `/todos` | Create a new todo |
| `PUT` | `/todos/:id` | Update an existing todo |
| `PATCH` | `/todos/:id/toggle` | Toggle completion status |
| `DELETE` | `/todos/:id` | Permanently delete a todo |

---

## 1. Health Check

### `GET /api/health`
Returns service and database health information.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "ZipTrip Todo API is running",
  "timestamp": "2026-09-21T17:00:00.000Z",
  "uptime": 142.5,
  "db": "connected"
}
```

---

## 2. Todo Statistics

### `GET /api/todos/stats`
Calculates real-time stats across all todos.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "total": 12,
    "completed": 4,
    "active": 8,
    "byPriority": {
      "high": 3,
      "medium": 4,
      "low": 1
    }
  }
}
```

---

## 3. List Todos

### `GET /api/todos`
Returns a list of todos sorted newest first (`createdAt: -1`).

**Query Parameters (all optional)**:
- `completed`: `true` | `false` (filter by status)
- `priority`: `low` | `medium` | `high` (filter by priority)
- `search`: string (case-insensitive full-text / regex search across title, description, and tags)

**Response `200 OK`**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "6ab16435eeecc62258658804",
      "title": "Complete Project Documentation",
      "description": "Document all features, APIs, and architecture in docs folder",
      "completed": false,
      "priority": "high",
      "tags": ["docs", "interview"],
      "createdAt": "2026-09-21T17:05:00.000Z",
      "updatedAt": "2026-09-21T17:05:00.000Z"
    }
  ]
}
```

---

## 4. Get Todo by ID

### `GET /api/todos/:id`

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "6ab16435eeecc62258658804",
    "title": "Complete Project Documentation",
    "description": "Document all features, APIs, and architecture in docs folder",
    "completed": false,
    "priority": "high",
    "tags": ["docs", "interview"],
    "createdAt": "2026-09-21T17:05:00.000Z",
    "updatedAt": "2026-09-21T17:05:00.000Z"
  }
}
```

**Error `404 Not Found`**:
```json
{
  "success": false,
  "error": "Todo not found"
}
```

---

## 5. Create Todo

### `POST /api/todos`

**Request Body**:
```json
{
  "title": "Build deployment script",
  "description": "Dockerize backend and frontend",
  "priority": "high",
  "tags": ["devops", "docker"]
}
```

**Validation Rules**:
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | **Yes** | 1 - 200 characters |
| `description` | `string` | No | Optional, defaults to `""` |
| `priority` | `string` | No | `"low"` \| `"medium"` \| `"high"` (default: `"medium"`) |
| `tags` | `string[]` | No | Array of strings (default: `[]`) |

**Response `201 Created`**:
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": "6ab165258bd3ffebe9c81142",
    "title": "Build deployment script",
    "description": "Dockerize backend and frontend",
    "completed": false,
    "priority": "high",
    "tags": ["devops", "docker"],
    "createdAt": "2026-09-21T17:10:00.000Z",
    "updatedAt": "2026-09-21T17:10:00.000Z"
  }
}
```

---

## 6. Update Todo

### `PUT /api/todos/:id`

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "description": "Updated details",
  "priority": "low",
  "completed": true,
  "tags": ["archive"]
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": "6ab165258bd3ffebe9c81142",
    "title": "Updated Title",
    "description": "Updated details",
    "completed": true,
    "priority": "low",
    "tags": ["archive"],
    "createdAt": "2026-09-21T17:10:00.000Z",
    "updatedAt": "2026-09-21T17:15:00.000Z"
  }
}
```

---

## 7. Toggle Status

### `PATCH /api/todos/:id/toggle`
Flips the `completed` boolean without requiring the full body payload.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Todo marked as completed",
  "data": {
    "id": "6ab165258bd3ffebe9c81142",
    "completed": true,
    ...
  }
}
```

---

## 8. Delete Todo

### `DELETE /api/todos/:id`
Permanently deletes the todo item.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": null
}
```
