import math

class KinematicsEngine:
    def __init__(self):
        # Constants for physical calculations
        self.GRAVITY = 9.81 # m/s^2
        
        # Standardized train metrics (can be dynamically updated from the spoofer)
        self.TRAIN_TYPES = {
            "freight_heavy": {"mass_kg": 4000000, "max_brake_decel": -0.4}, # Slower deceleration
            "express_passenger": {"mass_kg": 1500000, "max_brake_decel": -0.8},
            "suburban_local": {"mass_kg": 500000, "max_brake_decel": -1.2}  # Agile deceleration
        }

    def kmh_to_ms(self, speed_kmh):
        """Converts kilometers per hour to meters per second."""
        return speed_kmh * (5 / 18)

    def calculate_stopping_distance(self, current_speed_kmh, train_type, gradient_percentage=0.0):
        """
        Calculates the exact distance (in meters) required for a train to halt.
        Accounts for track elevation (gradient) to prevent topographical blindspots.
        """
        if train_type not in self.TRAIN_TYPES:
            raise ValueError("Unknown train classification.")

        # Convert initial velocity
        v_i = self.kmh_to_ms(current_speed_kmh)
        
        # Base deceleration capability of the train
        base_decel = self.TRAIN_TYPES[train_type]["max_brake_decel"]
        
        # Calculate the angle of the track gradient
        # Gradient % is (rise/run) * 100. We need the angle in radians.
        theta = math.atan(gradient_percentage / 100.0)
        
        # Effective deceleration factoring in gravity's pull on the slope
        # If going downhill (negative gradient), gravity fights the brakes.
        effective_decel = base_decel - (self.GRAVITY * math.sin(theta))
        
        # Safety catch: If gradient is so steep brakes fail, cap it to prevent math errors
        if effective_decel >= 0:
            return float('inf') # Train cannot stop on this slope
            
        # d = (-v_i^2) / (2 * a)
        stopping_distance = -(v_i ** 2) / (2 * effective_decel)
        
        return round(stopping_distance, 2)

# --- Quick Test Execution ---
if __name__ == "__main__":
    engine = KinematicsEngine()
    
    # Simulating a heavy freight train at 80 km/h on a flat track (0% gradient)
    flat_dist = engine.calculate_stopping_distance(80, "freight_heavy", 0.0)
    
    # Simulating the same train on a steep 2% downhill gradient (-2.0)
    downhill_dist = engine.calculate_stopping_distance(80, "freight_heavy", -2.0)
    
    print(f"Flat Track Stopping Distance: {flat_dist} meters")
    print(f"Downhill Stopping Distance: {downhill_dist} meters")