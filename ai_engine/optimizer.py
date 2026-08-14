from ai_engine.kinematics import KinematicsEngine

class ConflictOptimizer:
    def __init__(self):
        self.physics = KinematicsEngine()
        self.SAFE_MARGIN_SECONDS = 120  # Minimum 2 minutes between trains at a junction

    def calculate_eta(self, distance_km, speed_kmh):
        """Calculates time to reach junction in seconds."""
        if speed_kmh == 0:
            return float('inf')
        # distance / speed gives hours. Multiply by 3600 for seconds.
        return (distance_km / speed_kmh) * 3600

    def resolve_bottleneck(self, train_priority, train_yield, distance_p_km, distance_y_km):
        """
        Calculates the exact speed reduction for the yielding train so it arrives 
        smoothly after the priority train without halting.
        """
        # 1. Calculate current ETAs
        eta_p = self.calculate_eta(distance_p_km, train_priority["current_speed"])
        eta_y = self.calculate_eta(distance_y_km, train_yield["current_speed"])

        # 2. Check for conflict
        time_difference = abs(eta_p - eta_y)
        if time_difference >= self.SAFE_MARGIN_SECONDS:
            return {"status": "Clear", "message": "No conflict detected."}

        # 3. Calculate new target ETA for the yielding train
        # Yielding train must arrive exactly 120 seconds AFTER the priority train
        target_eta_y = eta_p + self.SAFE_MARGIN_SECONDS

        # 4. Calculate the required speed to hit that exact ETA
        # target_speed (km/h) = distance (km) / time (hours)
        target_speed_y = distance_y_km / (target_eta_y / 3600)
        
        # 5. Verify physics: Is this deceleration physically safe?
        # In a full model, we would calculate the exact braking curve over the distance.
        # For the PoC, we ensure the new speed is lower, but > 0 (no complete stops).
        target_speed_y = round(target_speed_y, 1)
        
        if target_speed_y <= 0:
            return {"status": "Critical", "message": "Yielding train must halt entirely."}

        return {
            "status": "Resolved",
            "action": f"Reduce {train_yield['id']} speed to {target_speed_y} km/h",
            "new_eta": f"{round(target_eta_y / 60, 1)} mins",
            "priority_eta": f"{round(eta_p / 60, 1)} mins"
        }

# --- Quick Test Execution ---
if __name__ == "__main__":
    optimizer = ConflictOptimizer()
    
    # Simulating the live data feed from the spoofer
    express_110 = {"id": "Express 110", "type": "express_passenger", "current_speed": 80.0}
    freight_402 = {"id": "Freight 402", "type": "freight_heavy", "current_speed": 75.0}
    
    # Both trains are exactly 40km away from Itarsi Junction
    resolution = optimizer.resolve_bottleneck(
        train_priority=express_110, 
        train_yield=freight_402, 
        distance_p_km=40.0, 
        distance_y_km=40.0
    )
    
    print("AI Resolution Output:")
    print(resolution)