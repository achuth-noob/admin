"use client";

import GpuPricingList from "@/components/admin/gpus/GpuPricingList";

export default function GpusPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">GPU Pricing</h2>
          <p className="text-muted-foreground">
            Manage GPU pricing per provider.
          </p>
        </div>
      </div>
      <GpuPricingList />
    </div>
  );
}
