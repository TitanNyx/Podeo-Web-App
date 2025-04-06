# Podeo Web App
\
Podeo Web App is a full-stack application featuring an Angular frontend and a Node.js/Express backend. The project includes user authentication, white-labeling support, and an admin dashboard where authorized users can generate, preview, and manage podcast shareable links. Additionally, the project includes Docker and GitHub Actions configuration for CI/CD and deployment.

***

## Features

* **User Authentication:**
Users can log in via a secure login page. Authentication tokens are stored in local storage, and unauthorized access redirects to the login page.

* **White-Labeling:**
Dynamic theme support allows the app’s look and feel to be adjusted (e.g., theme-light, theme-dark, theme-christmas, etc.). The theme is preserved between sessions using local storage.

* **Admin Dashboard:**
Admin users can generate shareable podcast links by providing an MP3 URL, an image URL, and an episode name. The dashboard displays previews (audio and image), a table of previously generated podcasts, and options to play, copy, or delete records.

* **Deployment Ready:**
The project includes Dockerfiles for both the frontend and backend, and GitHub Actions workflows to automate the build and deployment process.

***

## Prerequisites

* Node.js (version 18 or later) and npm

* Angular CLI installed globally (npm install -g @angular/cli)

* Docker Desktop (or Docker Engine on Linux) installed

* A GitHub account for repository and GitHub Actions configuration

***

## Installation
**Frontend (Angular)**
* Clone the repository:
`git clone https://github.com/yourusername/podeo-web-app.git`
`cd podeo-web-app/frontend/podeo-web-app/podeo-web-app/`

* Install dependencies:

`npm install`

* Run the Angular application:

`ng serve`

**The app will run at http://localhost:4200.**

**Backend (Node.js/Express)**
* Open a new terminal and navigate to the server folder:

`cd ../server`

* Install dependencies:

`npm install`

* Run the Express server:

`node index.js`

**The server will run on http://localhost:3000.**

***

# Docker Setup
**Building the Docker Images**

## Frontend Dockerfile

The Dockerfile for the frontend (Angular) is located in the frontend folder. It uses a two-stage build:

* Stage 1: Uses Node.js to build your Angular app.

* Stage 2: Uses Nginx to serve the built files.

## Backend Dockerfile

The Dockerfile for the backend (Express) is located in the server folder

## Running the Containers
**Build the Frontend Image:**

`cd frontend`
`docker build -t my-frontend .`

**Run the Frontend Container:**

`docker run -p 4200:80 my-frontend`

**Build the Backend Image:**

`cd ../server`
`docker build -t my-backend .`

**Run the Backend Container:**

`docker run -p 3000:3000 my-backend`

Now, your frontend is accessible at **http://localhost:4200** and your backend at **http://localhost:3000.**

***

# CI/CD with GitHub Actions

A sample GitHub Actions workflow **(.github/workflows/deploy.yml)** is included to automate building and pushing Docker images when code is pushed to the main branch.

**Notes:**

* GitHub Secrets:
Set DOCKER_USERNAME and DOCKER_PASSWORD in your repository's secrets.

* Directory Structure:
The workflow assumes the project has frontend and server folders.