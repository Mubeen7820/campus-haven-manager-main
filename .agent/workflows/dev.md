---
description: How to run and develop the Campus Haven Manager project
---

# Developer Workflow

This guide explains how to operate the project in its new split-folder architecture.

## 1. Initial Setup
Run this once to install all dependencies for both frontend and backend.
// turbo
```sh
npm run install-all
```

## 2. Local Development
Starts the Vite development server for the frontend.
// turbo
```sh
npm run dev
```

## 3. Database Updates
When you modify database schemas or triggers:
1. Open the files in `backend/*.sql`.
2. Copy the content.
3. Paste into the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql).
4. Run the query.

## 4. Testing Backend Scripts
To verify database connectivity or run utility scripts:
```sh
cd backend
npm install
node test-supabase.js
```

## 5. Building for Production
Prepares the frontend for deployment.
// turbo
```sh
npm run frontend:build
```
