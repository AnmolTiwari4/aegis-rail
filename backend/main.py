import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base
from app.websocket_manager import manager
from app.routers import trains, stations, alerts

# Initialize SQLite ORM tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start live telemetry generator task in background
    sim_task = asyncio.create_task(manager.start_simulation_loop())
    yield
    sim_task.cancel()

app = FastAPI(
    title="Aegis-Rail Dispatch API",
    description="Real-time Train Telemetry & Conflict Resolution Operations API",
    version="2.0.0",
    lifespan=lifespan
)

# CORS setup for frontend dashboard integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register REST API Routers
app.include_router(trains.router)
app.include_router(stations.router)
app.include_router(alerts.router)

@app.get("/")
async def root():
    return {"status": "ONLINE", "system": "Aegis-Rail Telemetry Dispatch", "version": "2.0.0"}

@app.websocket("/ws/api/v1/trains/live")
async def websocket_live_telemetry(websocket: WebSocket):
    """ws /api/v1/trains/live: WebSocket endpoint streaming real-time telemetry."""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive & listen for client ping/messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)