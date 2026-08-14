import csv
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Import your AI engine
from ai_engine.optimizer import ConflictOptimizer

# Initialize the FastAPI app
app = FastAPI()

# Apply security headers and CORS policies
# This allows Next.js (port 3000) to securely fetch data without browser blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Strictly validate all input to block field tampering or malformed CSV data
class TrainScenario(BaseModel):
    scenario_id: int
    train_1_id: str
    train_1_type: str
    train_1_weight: float = Field(..., gt=0)
    train_1_speed: float = Field(..., ge=0)
    train_2_id: str
    train_2_type: str
    train_2_weight: float = Field(..., gt=0)
    train_2_speed: float = Field(..., ge=0)
    location: str
    delay_risk: str

@app.get("/api/v1/scenario/{scenario_id}")
async def get_historical_scenario(scenario_id: int):
    file_path = Path("data/historical_logs.csv")
    
    if not file_path.exists():
        raise HTTPException(status_code=500, detail="Historical data vault offline.")

    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if int(row["scenario_id"]) == scenario_id:
                    
                    # 1. Validate the raw row data
                    validated_data = TrainScenario(**row)
                    
                    # 2. (Optional for later) Pass to your AI optimizer
                    # decision = ConflictOptimizer.calculate(validated_data)
                    
                    # 3. Trim API responses so the frontend only gets exactly what it needs
                    return {
                        "status": "success",
                        "scenario": validated_data.dict(),
                        "ai_recommendation": f"Reduce {validated_data.train_1_id} speed for priority clearance."
                    }
                    
            # If the loop finishes without finding the ID
            raise HTTPException(status_code=404, detail="Scenario not found.")
            
    except ValueError:
        raise HTTPException(status_code=422, detail="Data validation failed. Corrupted logs.")