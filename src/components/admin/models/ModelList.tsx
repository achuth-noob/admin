"use client";

import { useEffect, useState } from "react";
import { AdminApi } from "@/lib/admin-api";
import { ModelProvider } from "@/lib/types";
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

export default function ModelList() {
  const [models, setModels] = useState<ModelProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminApi.getAllModels();
      setModels(data);
    } catch (err) {
      console.error("Failed to fetch models", err);
      setError("Failed to load models. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Available Models</CardTitle>
        <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchModels} title="Refresh">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Model
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Model Name</TableHead>
                <TableHead>Owned By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Loading...
                  </TableCell>
                </TableRow>
              ) : models.length === 0 ? (
                 <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No models found.
                  </TableCell>
                </TableRow>
              ) : (
                models.map((model, index) => (
                  <TableRow key={`${model.provider}-${model.model}-${index}`}>
                    <TableCell className="font-medium">{model.provider}</TableCell>
                    <TableCell>{model.model}</TableCell>
                    <TableCell>{model.owned_by}</TableCell>
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
