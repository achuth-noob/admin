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

const gpus = [
    { id: "g1", name: "H100", memory: "80GB", provider: "NVIDIA", stock: 12 },
    { id: "g2", name: "A100", memory: "40GB", provider: "NVIDIA", stock: 45 },
    { id: "g3", name: "A6000", memory: "48GB", provider: "NVIDIA", stock: 8 },
];

export default function GpusPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">GPUs</h2>
                    <p className="text-muted-foreground">Manage GPU inventory and specifications.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add GPU
                </Button>
            </div>

             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Memory</TableHead>
                            <TableHead>Provider</TableHead>
                             <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gpus.map((gpu) => (
                            <TableRow key={gpu.id}>
                                <TableCell className="font-medium">{gpu.name}</TableCell>
                                <TableCell>{gpu.memory}</TableCell>
                                <TableCell>{gpu.provider}</TableCell>
                                <TableCell>{gpu.stock}</TableCell>
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
