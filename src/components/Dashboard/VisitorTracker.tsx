/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Globe, Monitor, Smartphone } from "lucide-react";

// Static tracker data
const staticTrackerData = {
  currentVisitors: 156,
  todayVisits: 1243,
  topLocations: [
    { country: "United States", count: 456, flag: "🇺🇸" },
    { country: "United Kingdom", count: 234, flag: "🇬🇧" },
    { country: "India", count: 189, flag: "🇮🇳" },
    { country: "Canada", count: 145, flag: "🇨🇦" },
    { country: "Australia", count: 98, flag: "🇦🇺" },
  ],
  deviceBreakdown: [
    { type: "Desktop", count: 678, percentage: 54.5 },
    { type: "Mobile", count: 456, percentage: 36.7 },
    { type: "Tablet", count: 109, percentage: 8.8 },
  ],
  browserBreakdown: [
    { name: "Chrome", count: 712, percentage: 57.3 },
    { name: "Safari", count: 289, percentage: 23.3 },
    { name: "Firefox", count: 156, percentage: 12.6 },
    { name: "Edge", count: 86, percentage: 6.8 },
  ],
};

export function VisitorTracker() {
  // Use static data directly
  const data = staticTrackerData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Live Visitor Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Visitors Card */}
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Current Visitors</p>
            <p className="text-3xl font-bold text-primary">
              {data.currentVisitors}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Active right now
            </p>
          </div>

          {/* Today's Visits Card */}
          <div className="bg-green-500/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Today Visits</p>
            <p className="text-3xl font-bold text-green-600">
              {data.todayVisits.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              +12.5% from yesterday
            </p>
          </div>

          {/* Top Location Card */}
          <div className="bg-blue-500/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Top Location</p>
            <p className="text-3xl font-bold text-blue-600 flex items-center gap-2">
              <span>{data.topLocations[0].flag}</span>
              {data.topLocations[0].country}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {data.topLocations[0].count} visitors
            </p>
          </div>

          {/* Devices Card */}
          <div className="bg-purple-500/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Top Device</p>
            <p className="text-3xl font-bold text-purple-600 flex items-center gap-2">
              <Monitor className="h-6 w-6" />
              {data.deviceBreakdown[0].type}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {data.deviceBreakdown[0].percentage}% of traffic
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Top Locations */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Top Locations
            </h4>
            <div className="space-y-2">
              {data.topLocations.map((location) => (
                <div
                  key={location.country}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{location.flag}</span>
                    <span className="text-sm font-medium">
                      {location.country}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {location.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Device & Browser Breakdown */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Device & Browser Stats
            </h4>

            {/* Device Breakdown */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Devices</p>
              {data.deviceBreakdown.map((device) => (
                <div key={device.type} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{device.type}</span>
                    <span className="font-medium">{device.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Browser Breakdown */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Browsers</p>
              {data.browserBreakdown.map((browser) => (
                <div key={browser.name} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{browser.name}</span>
                    <span className="font-medium">{browser.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 rounded-full h-2"
                      style={{ width: `${browser.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
