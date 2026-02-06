"use client";

import ModelList from "@/components/admin/models/ModelList";

export default function ModelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Models</h2>
          <p className="text-muted-foreground">
            Manage AI models and configurations.
          </p>
        </div>
      </div>
      <ModelList />
    </div>
  );
}
