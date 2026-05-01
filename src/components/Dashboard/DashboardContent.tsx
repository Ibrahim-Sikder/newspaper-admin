/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Eye, ThumbsUp, Users } from "lucide-react";
import { useMemo } from "react";
import { ContentCategoriesChart } from "./ContentCategoriesChart";
import { VisitorContacts } from "./VisitorContacts";
import { VisitorStatsChart } from "./VisitorStatsChart";
import { VisitorTracker } from "./VisitorTracker";

// Static visitor data - expanded for more realistic statistics
const staticVisitors = [
  // United States visitors
  {
    id: 1,
    ip: "192.168.1.1",
    visitedAt: "2024-01-15T10:30:00Z",
    sessionDuration: 245,
    contentCategory: "Politics",
    country: "United States",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: 2,
    ip: "192.168.1.1",
    visitedAt: "2024-01-15T14:20:00Z",
    sessionDuration: 150,
    contentCategory: "Business",
    country: "United States",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: 3,
    ip: "192.168.1.11",
    visitedAt: "2024-01-16T09:30:00Z",
    sessionDuration: 320,
    contentCategory: "Technology",
    country: "United States",
    browser: "Firefox 121.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0)",
  },
  {
    id: 4,
    ip: "192.168.1.12",
    visitedAt: "2024-01-16T11:45:00Z",
    sessionDuration: 180,
    contentCategory: "Sports",
    country: "United States",
    browser: "Safari 17.0",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  },
  {
    id: 5,
    ip: "192.168.1.13",
    visitedAt: "2024-01-17T13:15:00Z",
    sessionDuration: 290,
    contentCategory: "Entertainment",
    country: "United States",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },

  // United Kingdom visitors
  {
    id: 6,
    ip: "192.168.1.2",
    visitedAt: "2024-01-15T11:45:00Z",
    sessionDuration: 180,
    contentCategory: "Technology",
    country: "United Kingdom",
    browser: "Firefox 121.0",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0)",
  },
  {
    id: 7,
    ip: "192.168.1.2",
    visitedAt: "2024-01-15T18:15:00Z",
    sessionDuration: 280,
    contentCategory: "Sports",
    country: "United Kingdom",
    browser: "Safari 17.0",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)",
  },
  {
    id: 8,
    ip: "192.168.1.14",
    visitedAt: "2024-01-16T15:30:00Z",
    sessionDuration: 195,
    contentCategory: "Politics",
    country: "United Kingdom",
    browser: "Chrome 119.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },

  // Canada visitors
  {
    id: 9,
    ip: "192.168.1.3",
    visitedAt: "2024-01-15T12:15:00Z",
    sessionDuration: 320,
    contentCategory: "Sports",
    country: "Canada",
    browser: "Safari 17.0",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
  },
  {
    id: 10,
    ip: "192.168.1.3",
    visitedAt: "2024-01-16T09:15:00Z",
    sessionDuration: 190,
    contentCategory: "Politics",
    country: "Canada",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },
  {
    id: 11,
    ip: "192.168.1.15",
    visitedAt: "2024-01-17T10:45:00Z",
    sessionDuration: 265,
    contentCategory: "Technology",
    country: "Canada",
    browser: "Firefox 120.0",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15)",
  },

  // Australia visitors
  {
    id: 12,
    ip: "192.168.1.4",
    visitedAt: "2024-01-15T15:30:00Z",
    sessionDuration: 90,
    contentCategory: "Entertainment",
    country: "Australia",
    browser: "Edge 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: 13,
    ip: "192.168.1.16",
    visitedAt: "2024-01-16T22:15:00Z",
    sessionDuration: 310,
    contentCategory: "Business",
    country: "Australia",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },

  // India visitors
  {
    id: 14,
    ip: "192.168.1.5",
    visitedAt: "2024-01-15T16:45:00Z",
    sessionDuration: 420,
    contentCategory: "Politics",
    country: "India",
    browser: "Chrome 119.0",
    userAgent: "Mozilla/5.0 (Linux; Android 13)",
  },
  {
    id: 15,
    ip: "192.168.1.17",
    visitedAt: "2024-01-16T13:20:00Z",
    sessionDuration: 150,
    contentCategory: "Technology",
    country: "India",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Linux; Android 12)",
  },
  {
    id: 16,
    ip: "192.168.1.18",
    visitedAt: "2024-01-17T08:30:00Z",
    sessionDuration: 280,
    contentCategory: "Sports",
    country: "India",
    browser: "Firefox 120.0",
    userAgent: "Mozilla/5.0 (Android 13; Mobile)",
  },

  // Germany visitors
  {
    id: 17,
    ip: "192.168.1.6",
    visitedAt: "2024-01-15T17:30:00Z",
    sessionDuration: 200,
    contentCategory: "Technology",
    country: "Germany",
    browser: "Firefox 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0)",
  },
  {
    id: 18,
    ip: "192.168.1.19",
    visitedAt: "2024-01-16T19:45:00Z",
    sessionDuration: 230,
    contentCategory: "Business",
    country: "Germany",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },

  // France visitors
  {
    id: 19,
    ip: "192.168.1.7",
    visitedAt: "2024-01-15T19:00:00Z",
    sessionDuration: 110,
    contentCategory: "Business",
    country: "France",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  },

  // Japan visitors
  {
    id: 20,
    ip: "192.168.1.8",
    visitedAt: "2024-01-15T20:30:00Z",
    sessionDuration: 350,
    contentCategory: "Entertainment",
    country: "Japan",
    browser: "Safari 16.0",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
  },
  {
    id: 21,
    ip: "192.168.1.20",
    visitedAt: "2024-01-16T12:10:00Z",
    sessionDuration: 175,
    contentCategory: "Technology",
    country: "Japan",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  },

  // Brazil visitors
  {
    id: 22,
    ip: "192.168.1.9",
    visitedAt: "2024-01-16T10:45:00Z",
    sessionDuration: 270,
    contentCategory: "Technology",
    country: "Brazil",
    browser: "Firefox 121.0",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:121.0)",
  },

  // South Africa visitors
  {
    id: 23,
    ip: "192.168.1.10",
    visitedAt: "2024-01-16T11:30:00Z",
    sessionDuration: 130,
    contentCategory: "Sports",
    country: "South Africa",
    browser: "Edge 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },
  {
    id: 24,
    ip: "192.168.1.21",
    visitedAt: "2024-01-17T14:50:00Z",
    sessionDuration: 220,
    contentCategory: "Politics",
    country: "South Africa",
    browser: "Chrome 119.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },

  // Italy visitors
  {
    id: 25,
    ip: "192.168.1.22",
    visitedAt: "2024-01-17T16:20:00Z",
    sessionDuration: 185,
    contentCategory: "Entertainment",
    country: "Italy",
    browser: "Safari 17.0",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
  },
  {
    id: 26,
    ip: "192.168.1.23",
    visitedAt: "2024-01-17T18:35:00Z",
    sessionDuration: 305,
    contentCategory: "Sports",
    country: "Italy",
    browser: "Firefox 121.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0)",
  },

  // Spain visitors
  {
    id: 27,
    ip: "192.168.1.24",
    visitedAt: "2024-01-16T20:15:00Z",
    sessionDuration: 140,
    contentCategory: "Business",
    country: "Spain",
    browser: "Chrome 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },

  // Mexico visitors
  {
    id: 28,
    ip: "192.168.1.25",
    visitedAt: "2024-01-15T22:10:00Z",
    sessionDuration: 260,
    contentCategory: "Politics",
    country: "Mexico",
    browser: "Chrome 119.0",
    userAgent: "Mozilla/5.0 (Linux; Android 12)",
  },
  {
    id: 29,
    ip: "192.168.1.26",
    visitedAt: "2024-01-17T09:55:00Z",
    sessionDuration: 170,
    contentCategory: "Technology",
    country: "Mexico",
    browser: "Edge 120.0",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },

  // Netherlands visitors
  {
    id: 30,
    ip: "192.168.1.27",
    visitedAt: "2024-01-16T14:40:00Z",
    sessionDuration: 335,
    contentCategory: "Entertainment",
    country: "Netherlands",
    browser: "Firefox 120.0",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15)",
  },
];

export default function DashboardContent() {
  // Use static data directly - no API call
  const visitors = staticVisitors;

  // Process visitor data for statistics with REAL calculations
  const stats = useMemo(() => {
    if (!visitors || !visitors.length)
      return {
        totalUsers: 0,
        pageViews: 0,
        avgTime: "0m 0s",
        engagement: "0%",
      };

    // Calculate total unique users (based on unique IPs)
    const uniqueIps = new Set(visitors.map((visitor: any) => visitor.ip));
    const totalUsers = uniqueIps.size;

    // Calculate page views (each visitor entry counts as a page view)
    const pageViews = visitors.length;

    // Calculate average session duration from visitor data
    let totalSessionDuration = 0;
    let sessionCount = 0;

    visitors.forEach((visitor: any) => {
      if (visitor.sessionDuration) {
        totalSessionDuration += visitor.sessionDuration;
        sessionCount += 1;
      }
    });

    const avgSessionSeconds =
      sessionCount > 0 ? Math.floor(totalSessionDuration / sessionCount) : 0;
    const minutes = Math.floor(avgSessionSeconds / 60);
    const seconds = avgSessionSeconds % 60;
    const avgTime = `${minutes}m ${seconds}s`;

    // Calculate engagement rate based on repeat visitors
    const visitorCounts: { [key: string]: number } = {};
    visitors.forEach((visitor: any) => {
      const ip = visitor.ip;
      visitorCounts[ip] = (visitorCounts[ip] || 0) + 1;
    });

    const repeatVisitors = Object.values(visitorCounts).filter(
      (count) => count > 1,
    ).length;
    const engagementRate =
      totalUsers > 0 ? ((repeatVisitors / totalUsers) * 100).toFixed(1) : "0";
    const engagement = `${engagementRate}%`;

    return {
      totalUsers,
      pageViews,
      avgTime,
      engagement,
    };
  }, [visitors]);

  // Process visitor data for visitor stats chart
  const visitorStats = useMemo(() => {
    if (!visitors || !visitors.length) return [];

    // Group visitors by day of week
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayStats = daysOfWeek.map((day) => ({
      name: day,
      visitors: 0,
      pageViews: 0,
    }));

    visitors.forEach((visitor: any) => {
      const visitDate = new Date(visitor.visitedAt);
      const dayIndex = visitDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

      dayStats[dayIndex].visitors += 1;
      dayStats[dayIndex].pageViews += 1;
    });

    // Reorder to start with Monday
    const mondayFirst = [...dayStats.slice(1), dayStats[0]];
    return mondayFirst;
  }, [visitors]);

  // Process visitor data for content categories
  const categoryData = useMemo(() => {
    if (!visitors || !visitors.length) {
      return [
        { name: "Politics", value: 0 },
        { name: "Technology", value: 0 },
        { name: "Sports", value: 0 },
        { name: "Entertainment", value: 0 },
        { name: "Business", value: 0 },
      ];
    }

    const categoryMap: { [key: string]: number } = {
      Politics: 0,
      Technology: 0,
      Sports: 0,
      Entertainment: 0,
      Business: 0,
    };

    visitors.forEach((visitor: any) => {
      const category = visitor.contentCategory || "Politics";
      if (categoryMap.hasOwnProperty(category)) {
        categoryMap[category] += 1;
      } else {
        categoryMap["Politics"] += 1;
      }
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [visitors]);

  // Group visitors by country for location-based analysis
  const visitorsByCountry = useMemo(() => {
    if (!visitors || !visitors.length) return {};

    const countryMap: { [key: string]: number } = {};
    visitors.forEach((visitor: any) => {
      const country = visitor.country || "Unknown";
      countryMap[country] = (countryMap[country] || 0) + 1;
    });

    return countryMap;
  }, [visitors]);

  // Group visitors by browser
  const visitorsByBrowser = useMemo(() => {
    if (!visitors || !visitors.length) return {};

    const browserMap: { [key: string]: number } = {};
    visitors.forEach((visitor: any) => {
      const browserInfo = visitor.browser || "";
      let browserName = "Unknown";

      if (browserInfo.includes("Chrome")) browserName = "Chrome";
      else if (browserInfo.includes("Firefox")) browserName = "Firefox";
      else if (browserInfo.includes("Safari")) browserName = "Safari";
      else if (browserInfo.includes("Edge")) browserName = "Edge";

      browserMap[browserName] = (browserMap[browserName] || 0) + 1;
    });

    return browserMap;
  }, [visitors]);

  // Group visitors by device type
  const visitorsByDevice = useMemo(() => {
    if (!visitors || !visitors.length) return {};

    const deviceMap: { [key: string]: number } = {};
    visitors.forEach((visitor: any) => {
      const userAgent = visitor.userAgent || "";
      let deviceType = "Desktop";

      if (userAgent.includes("Mobile") || userAgent.includes("Android"))
        deviceType = "Mobile";
      else if (userAgent.includes("Tablet") || userAgent.includes("iPad"))
        deviceType = "Tablet";

      deviceMap[deviceType] = (deviceMap[deviceType] || 0) + 1;
    });

    return deviceMap;
  }, [visitors]);

  // Calculate bounce rate
  const bounceRate = useMemo(() => {
    if (!visitors || !visitors.length) return "0%";

    const visitorCounts: { [key: string]: number } = {};
    visitors.forEach((visitor: any) => {
      const ip = visitor.ip;
      visitorCounts[ip] = (visitorCounts[ip] || 0) + 1;
    });

    const bounces = Object.values(visitorCounts).filter(
      (count) => count === 1,
    ).length;
    const totalVisitors = Object.keys(visitorCounts).length;

    const rate =
      totalVisitors > 0 ? ((bounces / totalVisitors) * 100).toFixed(1) : "0";
    return `${rate}%`;
  }, [visitors]);

  // Calculate conversion metrics
  const conversionMetrics = useMemo(() => {
    if (!visitors || !visitors.length) {
      return {
        newVisitors: 0,
        returningVisitors: 0,
        conversionRate: "0%",
      };
    }

    const visitorCounts: { [key: string]: number } = {};
    visitors.forEach((visitor: any) => {
      const ip = visitor.ip;
      visitorCounts[ip] = (visitorCounts[ip] || 0) + 1;
    });

    const newVisitors = Object.values(visitorCounts).filter(
      (count) => count === 1,
    ).length;
    const returningVisitors = Object.values(visitorCounts).filter(
      (count) => count > 1,
    ).length;

    const totalVisitors = newVisitors + returningVisitors;
    const conversionRate =
      totalVisitors > 0
        ? ((returningVisitors / totalVisitors) * 100).toFixed(1)
        : "0";

    return {
      newVisitors,
      returningVisitors,
      conversionRate: `${conversionRate}%`,
    };
  }, [visitors]);

  // Direct return with static data - no loading/error states
  return (
    <div className="lg:p-4 space-y-4">
      <VisitorTracker />
      <VisitorContacts />

      {/* Primary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <h3 className="text-2xl font-bold">
                {stats.totalUsers.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Eye className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Page Views
              </p>
              <h3 className="text-2xl font-bold">
                {stats.pageViews.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-purple-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Session Time
              </p>
              <h3 className="text-2xl font-bold">{stats.avgTime}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <ThumbsUp className="h-8 w-8 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Engagement Rate
              </p>
              <h3 className="text-2xl font-bold">{stats.engagement}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="h-8 w-8 text-blue-500 mr-4 flex items-center justify-center font-bold">
              📊
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Bounce Rate
              </p>
              <h3 className="text-2xl font-bold">{bounceRate}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="h-8 w-8 text-green-600 mr-4 flex items-center justify-center font-bold">
              👤
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                New Visitors
              </p>
              <h3 className="text-2xl font-bold">
                {conversionMetrics.newVisitors.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="h-8 w-8 text-orange-500 mr-4 flex items-center justify-center font-bold">
              🔄
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Returning Visitors
              </p>
              <h3 className="text-2xl font-bold">
                {conversionMetrics.returningVisitors.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="h-8 w-8 text-red-500 mr-4 flex items-center justify-center font-bold">
              📈
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </p>
              <h3 className="text-2xl font-bold">
                {conversionMetrics.conversionRate}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Statistics by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <VisitorStatsChart data={visitorStats} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Categories Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ContentCategoriesChart data={categoryData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitors by Country */}
      <Card style={{ marginTop: "20px" }}>
        <CardHeader>
          <CardTitle>Visitors by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(visitorsByCountry).length > 0 ? (
              Object.entries(visitorsByCountry).map(([country, count]) => (
                <div
                  key={country}
                  className="flex justify-between items-center p-3 bg-muted rounded-md"
                >
                  <span className="font-medium text-sm">{country}</span>
                  <span className="text-primary font-bold">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No country data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visitors by Browser */}
      <Card>
        <CardHeader>
          <CardTitle>Visitors by Browser</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(visitorsByBrowser).length > 0 ? (
              Object.entries(visitorsByBrowser).map(([browser, count]) => (
                <div
                  key={browser}
                  className="flex justify-between items-center p-3 bg-muted rounded-md"
                >
                  <span className="font-medium text-sm">{browser}</span>
                  <span className="text-primary font-bold">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No browser data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visitors by Device Type */}
      <Card>
        <CardHeader>
          <CardTitle>Visitors by Device Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(visitorsByDevice).length > 0 ? (
              Object.entries(visitorsByDevice).map(([device, count]) => (
                <div
                  key={device}
                  className="flex justify-between items-center p-3 bg-muted rounded-md"
                >
                  <span className="font-medium text-sm">{device}</span>
                  <span className="text-primary font-bold">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No device data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
