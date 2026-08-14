from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import sys
import os

# Allow the backend to import from the ai_engine sibling directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ai_engine.optimizer import ConflictOptimizer

app = FastAPI(title="Aegis-Rail Core API", version="1.0.0")

# --- Security & Headers ---
# Restricting CORS to the specific frontend domain and enforcing strict security headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://terminal-six-aegis.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Injects strict transport security (Force HTTPS) and prevents MIME-sniffing."""
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response

# --- Input Validation Models ---
# Strict validation blocks malformed data or field tampering from crashing the AI
class TrainData(BaseModel):
    id: str = Field(..., min_length=1, max_length=50)
    type: str = Field(..., pattern="^(freight_heavy|express_passenger|suburban_local)$")
    current_speed: float = Field(..., ge=0.0, le=200.0)

class OptimizationRequest(BaseModel):
    train_priority: TrainData
    train_yield: TrainData
    distance_p_km: float = Field(..., gt=0.0)
    distance_y_km: float = Field(..., gt=0.0)

class OptimizationResponse(BaseModel):
    status: str
    action: str = None
    new_eta: str = None
    priority_eta: str = None

# --- API Endpoints ---
# Initialize the AI Engine instance
ai_optimizer = ConflictOptimizer()

@app.post("/api/v1/optimize", response_model=OptimizationResponse)
async def optimize_junction(payload: OptimizationRequest):
    """
    Ingests live train telemetry, routes it to the AI physics engine, 
    and returns a trimmed, actionable response for the UI.
    """
    try:
        # Convert Pydantic models to dicts for the AI engine
        priority_dict = payload.train_priority.model_dump()
        yield_dict = payload.train_yield.model_dump()
        
        # Execute the AI logic
        resolution = ai_optimizer.resolve_bottleneck(
            train_priority=priority_dict,
            train_yield=yield_dict,
            distance_p_km=payload.distance_p_km,
            distance_y_km=payload.distance_y_km
        )
        
        # Return exactly what the UI needs, trimming any unnecessary backend metadata
        return JSONResponse(content=resolution)
        
    except Exception as e:
        # Prevent internal server stack traces from leaking to the client
        raise HTTPException(status_code=500, detail="Internal AI Engine Failure")

# --- Local Execution ---
if __name__ == "__main__":
    import uvicorn
    # Runs the server locally on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)