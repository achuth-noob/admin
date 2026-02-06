"use client";

import { useEffect, useState } from "react";
import { AdminApi } from "@/lib/admin-api";
import { GpuPricing } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, RefreshCw } from "lucide-react";

// Providers matching backend GpuProviders enum
const PROVIDERS = [
  "novita",
  "nebius_ai",
  "datacrunch",
  "runpod",
  "vastai",
  "vultr"
];

export default function GpuPricingList() {
  const [selectedProvider, setSelectedProvider] = useState("novita");
  const [pricingList, setPricingList] = useState<GpuPricing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminApi.getGpuPricingList(selectedProvider);
      setPricingList(data);
    } catch (err) {
      console.error("Failed to fetch GPU pricing", err);
      setError("Failed to load GPU pricing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [selectedProvider]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>GPU Pricing</CardTitle>
        <div className="flex items-center gap-4">
            <select 
                className="p-2 border rounded-md"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
            >
                {PROVIDERS.map(p => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={fetchPricing} title="Refresh">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add GPU
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GPU Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Price/Hr</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && pricingList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Loading...
                  </TableCell>
                </TableRow>
              ) : pricingList.length === 0 ? (
                 <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No pricing data found for {selectedProvider}.
                  </TableCell>
                </TableRow>
              ) : (
                pricingList.map((gpu, index) => (
                  <TableRow key={`${gpu.gpu_id}-${index}`}>
                    <TableCell className="font-medium">{gpu.gpu_name}</TableCell>
                    <TableCell>{gpu.region}</TableCell>
                    <TableCell>${gpu.price_per_hour?.toFixed(4)}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${gpu.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {gpu.is_available ? 'Available' : 'Unavailable'}
                        </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
