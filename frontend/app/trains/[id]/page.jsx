'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Speedometer from '../../../components/Speedometer';
import { useWebSocketTelemetry } from '../../../hooks/useWebSocketTelemetry';

export default function TrainTelemetryPage({ params }) {
  const trainId = params?.id || 'TR-801';
  const { telemetryData } = useWebSocketTelemetry();
  const [routeData, setRouteData] = useState(null);

  // Fetch static route data from FastAPI
  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/trains/${trainId}/route`)
      .then((res) => res.json())
      .then((data) => setRouteData(data))
      .catch(() => {
        // Fallback default mock if API is offline
        setRouteData({
          train_id: trainId,
          locomotive_model: "Vande Bharat Express (Class 18)",
          max_speed_limit: 160.0,
          max_capacity: 1128,
          max_weight: 3000.0,
          current_weight: 2450.0,
          passenger_count: 420,
          current_speed: 112.5,
          delay_delta_minutes: +3.5,
          route_waypoints: [
            { station_id: "NDLS", station_name: "New Delhi Central", eta: "10:00 AM", status: "COMPLETED" },
            { station_id: "CNB", station_name: "Kanpur Central", eta: "02:15 PM", status: "IN_TRANSIT" },
            { station_id: "PRYJ", station_name: "Prayagraj Junction", eta: "05:00 PM", status: "SCHEDULED" },
            { station_id: "BSB", station_name: "Varanasi Junction", eta: "07:30 PM", status: "SCHEDULED" },
          ]
        });
      });
  }, [trainId]);

  // Find live dynamic telemetry stream matching this train_id
  const liveMatch = telemetryData.find((t) => t.train_id === trainId);
  const currentSpeed = liveMatch ? liveMatch.current_speed : (routeData?.current_speed || 112.5);
  const currentWeight = liveMatch ? liveMatch.current_weight : (routeData?.current_weight || 2450.0);
  const passengerCount = liveMatch ? liveMatch.passenger_count : (routeData?.passenger_count || 420);

  if (!routeData) {
    return <div className="p-8 text-center text-orange-500 font-mono">LOADING LOCOMOTIVE TELEMETRY...</div>;
  }

  return (
    <div className="w-full bg-black min-h-screen p-4 md:p-6 font-mono space-y-6">
      
      {/* Back Link & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-zinc-800 bg-zinc-950 p-4">
        <div>
          <Link href="/dashboard" className="text-orange-500 text-xs hover:underline block mb-1">
            ← BACK TO GOD VIEW MATRIX
          </Link>
          <h1 className="text-xl md:text-2xl font-bold uppercase text-white tracking-wider flex items-center gap-3">
            LOCOMOTIVE TELEMETRY // {routeData.train_id}
          </h1>
          <span className="text-zinc-500 text-xs block mt-1">MODEL: {routeData.locomotive_model}</span>
        </div>

        {/* Delay Delta Indicator */}
        <div className={`border p-3 text-right font-mono ${
          routeData.delay_delta_minutes > 0 ? 'border-yellow-600 bg-yellow-950/40 text-yellow-400' : 'border-orange-500 bg-zinc-900 text-orange-400'
        }`}>
          <span className="text-[10px] text-zinc-400 block uppercase">DELAY DELTA</span>
          <span className="text-xl font-extrabold">
            {routeData.delay_delta_minutes > 0 ? `+${routeData.delay_delta_minutes} MINS` : `${routeData.delay_delta_minutes} MINS (ON TIME)`}
          </span>
        </div>
      </div>

      {/* Main Grid: Speedometer + Load Metrics + Route Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Speedometer & Tonnage/Passenger Load Cards */}
        <div className="space-y-6">
          
          {/* Dynamic Speedometer Gauge */}
          <Speedometer currentSpeed={currentSpeed} maxLimit={routeData.max_speed_limit} />

          {/* Load Metrics Card */}
          <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-4">
            <h3 className="text-orange-500 font-bold text-xs uppercase tracking-wider border-b border-zinc-800 pb-2">
              LOAD & TONNAGE METRICS
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>GROSS WEIGHT TONNAGE</span>
                  <span className="text-white font-bold">{currentWeight} / {routeData.max_weight} t</span>
                </div>
                <div className="w-full bg-zinc-900 h-2">
                  <div
                    className="bg-orange-500 h-2"
                    style={{ width: `${Math.min(100, (currentWeight / routeData.max_weight) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>PASSENGER OCCUPANCY</span>
                  <span className="text-white font-bold">{passengerCount} / {routeData.max_capacity}</span>
                </div>
                <div className="w-full bg-zinc-900 h-2">
                  <div
                    className="bg-orange-500 h-2"
                    style={{ width: `${Math.min(100, (passengerCount / (routeData.max_capacity || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Vertical Route Timeline & Dynamic ETAs (2 Cols) */}
        <div className="lg:col-span-2 border border-zinc-800 bg-zinc-950 p-6 space-y-6">
          <h3 className="text-orange-500 font-bold text-xs uppercase tracking-wider border-b border-zinc-800 pb-3">
            VERTICAL ROUTE TIMELINE & DYNAMIC STATIONS ETAs
          </h3>

          <div className="relative pl-6 space-y-8 border-l-2 border-zinc-800 my-4">
            {routeData.route_waypoints.map((stn, idx) => {
              const isDone = stn.status === 'COMPLETED';
              const isInTransit = stn.status === 'IN_TRANSIT';

              return (
                <div key={stn.station_id} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 border border-black ${
                    isDone ? 'bg-zinc-600' : isInTransit ? 'bg-orange-500 animate-ping' : 'bg-zinc-900 border-zinc-700'
                  }`} />
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 border ${
                    isDone ? 'bg-zinc-600 border-zinc-500' : isInTransit ? 'bg-orange-500 border-orange-300' : 'bg-zinc-950 border-zinc-700'
                  }`} />

                  <div className="border border-zinc-900 bg-black p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <span className="text-xs text-orange-500 font-bold tracking-widest">{stn.station_id}</span>
                      <h4 className="text-white font-bold text-base">{stn.station_name}</h4>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">SCHEDULED ETA</span>
                        <span className="text-zinc-300 font-bold">{stn.eta}</span>
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-bold border ${
                        isDone ? 'border-zinc-800 bg-zinc-900 text-zinc-500' :
                        isInTransit ? 'border-orange-500 bg-orange-950 text-orange-400' :
                        'border-zinc-800 bg-black text-zinc-400'
                      }`}>
                        {stn.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
