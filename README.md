# AegisRail : AI Powered Railway Traffic and Conflict Optimization System

AegisRail is an intelligent railway decision support and conflict resolution platform for Indian Railways. It helps railway controllers manage traffic, prevent track bottlenecks, optimize train movements, and keep train operations safe.

## Table of Contents

1. Overview
2. Key Features
3. System Architecture
4. How the Optimization Works
5. Technologies Used
6. Project Structure
7. Installation and Setup
8. API and WebSocket Endpoints
9. Controller Workflow and Failsafe
10. Team and Credits

## Overview

Railway networks frequently face traffic congestion, signal delays, and collision risks when high speed passenger trains and heavy freight trains share the same tracks.

AegisRail combines physics formulas with Google OR Tools optimization and a live web dashboard. It helps railway section controllers by:

* Detecting track conflicts automatically and suggesting the best train to give priority.
* Calculating train weight and momentum so heavy trains do not lose speed unnecessarily.
* Giving controllers a 60 second countdown timer to confirm decisions, with automatic fallback protection.
* Recording all controller choices in a permanent audit log.

## Key Features

* Live Train Updates: Streams live train speed, weight, location, and track status using WebSockets.
* Physics Calculations: Calculates stopping distances and train momentum in real time for different train types such as Freight, Express, and Commuter trains.
* Conflict Resolution: Uses Google OR Tools to calculate optimal track access and prevent collisions.
* 60 Second Decision Window: Gives the human controller time to approve recommendations or manually pick a route.
* Alert Management: Categorizes warnings into Critical, Warning, and Resolved statuses.
* Audit Log: Records every human decision and automated action for safety records.
* Modern Dashboard: Provides an easy to use interface with visual speedometers and route indicators.

## System Architecture

The system consists of three main layers:

1. Data Layer: Reads train operational records and historical logs.
2. Backend Service: Built with FastAPI, containing the physics engine, Google OR Tools optimizer, REST API endpoints, and WebSocket streaming server.
3. Frontend Dashboard: Built with Next.js and Tailwind CSS to display live telemetry, speed gauges, and alert notifications.

## How the Optimization Works

### Physics Calculations

The system calculates stopping distance using the standard formula:

Stopping Distance = (Speed in meters per second squared) / (2 * Deceleration Rate)

Deceleration rates used by train type:
* Heavy Freight: 0.4 meters per second squared
* Freight: 0.5 meters per second squared
* Express: 0.8 meters per second squared
* Commuter or Local: 1.0 meters per second squared
* High Speed: 1.2 meters per second squared

Train momentum is calculated as:

Momentum = Mass in kilograms * Speed in meters per second

### Google OR Tools Optimizer

When two trains approach the same track junction:
* Only one train can take the main track.
* The other train is safely diverted or paused.
* The system chooses the train with greater momentum to continue on the main track, saving energy and avoiding network delays.

## Technologies Used

* Frontend: Next.js, React, Tailwind CSS, Framer Motion
* Backend: Python, FastAPI, Uvicorn, WebSockets
* Optimization Engine: Google OR Tools
* Data Validation: Pydantic
* Database: SQLite

## Project Structure

* backend/ai_engine/kinematics.py : Physics calculations for momentum and stopping distance
* backend/ai_engine/optimizer.py : Google OR Tools conflict optimization logic
* backend/app/ : Database models, schemas, and connection utilities
* backend/data/ : Train logs and simulation datasets
* backend/main.py : FastAPI entry point, REST endpoints, and WebSocket server
* backend/requirements.txt : Python packages list
* frontend/app/page.jsx : Main command center interface
* frontend/app/alerts/page.jsx : Safety alerts and triage screen
* frontend/components/ : UI components including speedometers and navigation
* frontend/package.json : Node.js dependencies and run scripts

## Installation and Setup

### Prerequisites

* Node.js version 18 or above
* Python version 3.10 or above
* Git

### Backend Setup

Step 1: Open a terminal and go to the backend folder:
`cd backend`

Step 2: Create a virtual environment:
`python -m venv venv`

Step 3: Activate the virtual environment:
On Windows: `.\venv\Scripts\activate`
On Linux or macOS: `source venv/bin/activate`

Step 4: Install dependencies:
`pip install -r requirements.txt`

Step 5: Start the server:
`uvicorn main:app --reload`

The backend runs at http://localhost:8000 (API documentation is available at http://localhost:8000/docs).

### Frontend Setup

Step 1: Open a second terminal and go to the frontend folder:
`cd frontend`

Step 2: Install dependencies:
`npm install`

Step 3: Start the local development server:
`npm run dev`

Open http://localhost:3000 in your browser to view the command dashboard.

## API and WebSocket Endpoints

### REST API Endpoints

* GET /api/v1/alerts : Returns all active and historical alerts.
* POST /api/v1/alerts/trigger : Adds a new safety alert.
* GET /api/v1/kpi : Returns network efficiency and delay prevention metrics.
* POST /api/v1/audit/approve : Saves the controller action to the audit log.

### WebSocket Endpoint

* URL: ws://localhost:8000/ws/stream
* Message to send: Send NEXT to request the next train scenario.
* Response: Returns the scenario data, train speeds, calculated stopping distances, and the AI recommended action.

## Controller Workflow and Failsafe

1. The system detects two trains approaching a single track bottleneck.
2. The physics engine calculates stopping distance and momentum.
3. Google OR Tools finds the best routing choice.
4. The dashboard shows the recommendation and starts a 60 second countdown timer.
5. The railway controller can approve the suggestion or choose an alternative train.
6. If the countdown reaches zero without controller input, the system automatically applies the safest recommendation.
7. The final decision is stored in the audit trail.

## Team and Credits

Developed for the Smart India Hackathon (SIH) to improve railway traffic management and train safety.
