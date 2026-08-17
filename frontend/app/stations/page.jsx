'use client';

import { useState, useEffect } from 'react';

export default function StationControlPage() {
  const [selectedStation, setSelectedStation] = useState('NDLS');
  const [stationData, setStationData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/stations/${selectedStation}`)
      .then((res) => res.json())
      .then((data) => setStationData(data))
      .catch(() => {
        setStationData({
          station_id: selectedStation,
          station_name: `${selectedStation} Central Hub`,
          platforms_count: 16,
          active_trains_count: 8,
          manifest: [
            { train_id: "TR-801", platform: 4, type: "PASSENGER", eta: "10:15 AM", status: "INBOUND", delay_min: 3 },
            { train_id: "TR-202", platform: 1, type: "EXPRESS", eta: "10:30 AM", status: "OUTBOUND", delay_min: 0 },
            { train_id: "TR-909", platform: 7, type: "SUPERFAST", eta: "11:00 AM", status: "INBOUND", delay_min: -1 },
            { train_id: "TR-102", platform: 12, type: "FREIGHT", eta: "11:45 AM", status: "OUTBOUND", delay_min: 15 },
          ]
        });
      });
  }, [selectedStation]);

  const stationsList = ['NDLS', 'CSTM', 'MAS', 'HWH'];

  return (
    <div className="w-full bg-black min-h-screen p-4 md:p-6 font-mono space-y-6">
      
      {/* Header & Station Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-zinc-800 bg-zinc-950 p-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold uppercase text-white tracking-wider flex items-center gap-3">
            <span className="w-3 h-3 bg-orange-500 inline-block"></span>
            STATION CONTROL HUB // PLATFORM ALLOCATION
          </h1>
          <p className="text-zinc-500 text-xs mt-1">INBOUND/OUTBOUND MANIFESTS & GANTT CLEARANCE</p>
        </div>

        {/* Station Tabs */}
        <div className="flex gap-2">
          {stationsList.map((stn) => (
            <button
              key={stn}
              onClick={() => setSelectedStation(stn)}
              className={`px-4 py-2 border text-xs font-bold uppercase transition-all ${
                selectedStation === stn
                  ? 'bg-orange-600 border-orange-400 text-black shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                  : 'bg-black border-zinc-800 text-zinc-400 hover:border-orange-500/50 hover:text-white'
              }`}
            >
              {stn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Platform Allocation Gantt Chart & Manifest Table */}
      <div className="space-y-6">
        
        {/* Platform Allocation Gantt Chart Visualizer */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h3 className="text-orange-500 font-bold text-xs uppercase tracking-wider">
              PLATFORM OCCUPANCY GANTT CHART ({stationData?.station_name})
            </h3>
            <span className="text-zinc-500 text-[10px]">TIME AXIS: 09:00 - 13:00 HRS</span>
          </div>

          {/* Gantt Matrix Grid */}
          <div className="space-y-3 pt-2">
            {[1, 2, 4, 7, 12].map((platformNum) => {
              const assignedTrain = stationData?.manifest.find((m) => m.platform === platformNum);

              return (
                <div key={platformNum} className="flex items-center gap-4 text-xs">
                  <div className="w-24 border border-zinc-800 bg-black p-2 text-center font-bold text-zinc-300">
                    PLATFORM {platformNum}
                  </div>

                  <div className="flex-1 h-10 border border-zinc-900 bg-black relative flex items-center px-2">
                    {assignedTrain ? (
                      <div
                        className={`absolute h-7 px-3 flex items-center justify-between border font-bold text-[11px] ${
                          assignedTrain.status === 'INBOUND'
                            ? 'bg-orange-950/80 border-orange-500 text-orange-300'
                            : 'bg-zinc-900 border-zinc-600 text-zinc-200'
                        }`}
                        style={{
                          left: `${(platformNum * 12) % 60}%`,
                          width: '35%'
                        }}
                      >
                        <span>{assignedTrain.train_id} ({assignedTrain.type})</span>
                        <span className="text-[10px] opacity-80">{assignedTrain.eta}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-700 text-[10px] italic">CLEAR / UNALLOCATED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inbound/Outbound Manifest Table */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <h3 className="text-orange-500 font-bold text-xs uppercase tracking-wider border-b border-zinc-800 pb-3">
            STATION INBOUND / OUTBOUND MANIFEST
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 bg-black">
                  <th className="p-3">LOCOMOTIVE ID</th>
                  <th className="p-3">ASSIGNED PLATFORM</th>
                  <th className="p-3">TRAIN TYPE</th>
                  <th className="p-3">SCHEDULED ETA</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">DELAY DELTA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {stationData?.manifest.map((row) => (
                  <tr key={row.train_id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="p-3 font-bold text-white">{row.train_id}</td>
                    <td className="p-3 text-orange-400 font-bold">PLATFORM #{row.platform}</td>
                    <td className="p-3 text-zinc-400">{row.type}</td>
                    <td className="p-3 text-white">{row.eta}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold border ${
                        row.status === 'INBOUND' ? 'border-orange-500 bg-orange-950 text-orange-400' : 'border-zinc-700 bg-zinc-900 text-zinc-300'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-yellow-400">
                      {row.delay_min > 0 ? `+${row.delay_min} mins` : 'ON TIME'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
