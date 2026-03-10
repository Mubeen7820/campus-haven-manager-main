# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Project Structure

The project has been organized into two main folders:

- **frontend/**: Contains the React + Vite application code.
- **backend/**: Contains Supabase SQL scripts and utility database scripts.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed.

### Setting up the Frontend:

```sh
# Step 1: Navigate to the frontend directory
cd frontend

# Step 2: Install the necessary dependencies
npm install

# Step 3: Start the development server
npm run dev
```

Alternatively, from the root directory, you can use:
- `npm run frontend:install` - To install frontend dependencies.
- `npm run frontend:dev` - To start the frontend development server.
- `npm run frontend:build` - To build the frontend.

### Backend/Database Scripts:

The `backend/` folder contains SQL scripts for Supabase and JS utility scripts. You can run the JS scripts using Node.js:

```sh
node backend/test-supabase.js
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
