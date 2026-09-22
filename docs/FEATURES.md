# 🚀 Features & Architecture Documentation

This document outlines all implemented features, user experience behaviors, and architectural choices in the ZipTrip Todo Application.

---

## 1. System Architecture

| Component | Technology | Description |
|---|---|---|
| **Architecture Pattern** | **MPA (Multi-Page App)** | Two independent HTML entrypoints (`index.html` for List view, `todo.html` for Detail view) |
| **Frontend Framework** | **React 18** | Client-side reactive UI rendering with state hooks |
| **Bundler & Tooling** | **Vite 5** | High-performance dev server with fast HMR & multi-page Rollup builds |
| **Styling** | **Tailwind CSS 3** | Custom tailored color tokens, keyframe animations, and utilities |
| **Backend Framework** | **Express 4 + Node.js** | Modular layered REST API (routes, controllers, services, models) |
| **Database** | **MongoDB (Mongoose 9)** | Document store with schemas, indexes, and automatic timestamps |
| **Testing** | **Jest 29 + Supertest 7** | Comprehensive integration tests verifying health, CRUD, and errors |

---

## 2. User Experience & Design System

### 2.1 Theme & Aesthetics
- **Background**: Soft modern light gray canvas (`#f1f5f9` / `slate-100`) providing high contrast.
- **Surface Cards**: Pure white (`#ffffff`) with subtle border shadows (`rgba(0,0,0,0.06)`) and interactive hover lifts (`translateY(-2px)`).
- **Typography**: Clean, readable Google Font **Inter** with solid black active titles (`text-black`) and slate secondary descriptions (`text-slate-600`).
- **Brand Accent**: Modern royal purple / violet gradient accents (`#7c3aed` to `#5b21b6`).

### 2.2 Micro-Animations
- **Hover Transitions**: Action buttons lift subtly on hover (`translateY(-1px)`).
- **Press Bounces (`pop`)**: Buttons and checkboxes scale dynamically on click for tactile feedback.
- **Ripple Layer**: Subtle translucent overlay upon active clicks.

---

## 3. Key Functionalities

### 3.1 List Page (`/index.html`)
- **Dashboard Stats**:
  - Live counts for **Total Todos**, **Active Todos**, **Completed Todos**, and **High Priority Active Items**.
- **Interactive Todo Cards**:
  - Checkbox toggle with instant state update.
  - Color-coded priority badges:
    - 🔴 **High** (translucent rose pill)
    - 🟡 **Medium** (translucent amber pill)
    - 🟢 **Low** (translucent emerald pill)
  - Clickable title navigating to individual todo detail view (`/todo.html?id=...`).
  - Tag chips highlighting labels (e.g. `#work`, `#personal`).
  - Description preview with automatic text clamp.

### 3.2 Filtering & Searching
- **Status Tabs**: Instant tab switching across `All`, `Active`, and `Completed`.
- **Priority Filter**: Dropdown to filter exclusively by `High`, `Medium`, or `Low`.
- **Live Search**: Debounced search bar querying matching text across title, description, and tags simultaneously.

### 3.3 Create Todo Form
- Smooth toggle button (`+ Add Todo` / `Cancel`).
- Inline creation card with:
  - **Title** (required input with validation)
  - **Description** (textarea for notes)
  - **Priority Selector** (Low, Medium, High)
  - **Tags Input** (comma-separated tag parser)
- Submission feedback via floating bottom-right success bar.

### 3.4 Modern Delete Confirmation Modal (`ConfirmModal.jsx`)
- When the user clicks **Delete**:
  1. A modern modal appears with a soft backdrop blur (`backdrop-blur-sm`).
  2. Displays a warning icon and prompt: *"Are you sure you want to delete this todo permanently? This cannot be undone."*
  3. Clicking **"No, Cancel"** closes the modal safely without deleting anything.
  4. Clicking **"Yes, Delete"** permanently deletes the item from MongoDB and triggers the success notification.

### 3.5 Floating Success / Notification Bar (`Toast.jsx`)
- Replaces disruptive browser alerts.
- Positioned in the **bottom-right corner** (`fixed bottom-6 right-6 z-50`).
- Features:
  - Glassmorphic card styling with backdrop blur.
  - Status indicator (emerald checkmark for success, rose for errors).
  - Smooth slide-up & scale-in animation (`toast-enter`).
  - **Auto-dismisses** after 3.5 seconds with an optional manual dismiss close button (`×`).
  - Triggered upon **Creating** and **Deleting** items.

### 3.6 Detail & Edit Page (`/todo.html?id=...`)
- Loaded via query parameter `?id=<MongoDB ObjectId>`.
- Displays complete metadata: Title, Description, Priority, Tags, Created timestamp, and internal ID.
- **Inline Editing Mode**: Allows updating Title, Description, Priority, Completion status, and Tags.
- **Action Toolbar**: Quick Status Toggle, Edit / Save Changes, and Delete (with confirmation modal).
