# EventSupply — Classic Static Website

This is a pure static HTML/CSS/JavaScript version of the Event Material Supply & Collaboration System.

## Deploy on Render Static Site

Build command:
```text
leave empty
```

Publish directory:
```text
.
```

There is no Python, Flask, or server required.

## Run locally

Open `index.html` in a browser.

For best results, use VS Code Live Server.

## Important

This static version uses browser `localStorage` for demonstration data. It does NOT provide a shared online database or real multi-user login.

The initial demo data includes:
- 3 organizations
- 2 customers
- 2 events
- 4 materials
- 1 material request
- 1 collaboration

You can add records from the website. Data is stored in the browser on the device being used.

For a real multi-user production application with shared data, use the Flask backend version or connect this frontend to a backend/database API.
