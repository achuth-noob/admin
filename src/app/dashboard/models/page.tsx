import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

const models = [
  {
    id: "m1",
    name: "Llama 3 8B",
    provider: "Meta",
    type: "Text Generation",
    status: "Active",
  },
  {
    id: "m2",
    name: "Mistral 7B",
    provider: "Mistral AI",
    type: "Text Generation",
    status: "Active",
  },
  {
    id: "m3",
    name: "Stable Diffusion XL",
    provider: "Stability AI",
    type: "Image Generation",
    status: "Maintenance",
  },
];

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
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Model
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>{model.provider}</TableCell>
                <TableCell>{model.type}</TableCell>
                <TableCell>{model.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
