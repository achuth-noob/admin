import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

const templates = [
    { id: 't1', name: 'Llama 3 Chat', description: 'Pre-configured chat interface for Llama 3.' },
    { id: 't2', name: 'Stable Diffusion API', description: 'API endpoint template for image generation.' },
    { id: 't3', name: 'RAG Pipeline', description: 'Retrieval Augmented Generation starter kit.' },
]

export default function TemplatesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Templates</h2>
                    <p className="text-muted-foreground">Manage deployment templates.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Template
                </Button>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                    <Card key={template.id}>
                        <CardHeader>
                            <CardTitle>{template.name}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Manage</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
