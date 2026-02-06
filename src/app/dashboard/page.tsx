"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Cpu, Users, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminApi } from "@/lib/admin-api";
import { ModelProvider, AdminUser } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalModels: 0,
    activeGpus: 0,
    registeredUsers: 0,
    recentActivity: "No recent activity."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Execute in parallel
        const [models, admins] = await Promise.all([
           AdminApi.getAllModels().catch(err => { console.error("Failed to fetch models", err); return []; }),
           AdminApi.getAdminDetails().catch(err => { console.error("Failed to fetch admins", err); return []; })
        ]);

        // Note: There isn't a direct "Active GPUs" count endpoint readily available in the simple analysis
        // without iterating through all providers, so we might mock this or add a specific endpoint later.
        // For now, we will use a placeholder or calculate if possible.
        // Also "Registered Users" might usually refer to end-users, but we only have getAdminDetails accessible easily.
        // As a starting point, we'll display what we can access.
        
        setStats({
          totalModels: models.length,
          activeGpus: 0, // Placeholder until we hook up a proper GPU status endpoint
          registeredUsers: admins.length, // Showing admins for now as "Users" in this context, or 0 if strictly end-users
          recentActivity: "System initialized."
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalModels}</div>
            <p className="text-xs text-muted-foreground">
              Available models
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active GPUs</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.activeGpus}</div>
            <p className="text-xs text-muted-foreground">
              Online instances
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.registeredUsers}</div>
            <p className="text-xs text-muted-foreground">
              System administrators
            </p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">
                All systems operational
            </p>
            </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-sm text-gray-500">{stats.recentActivity}</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
