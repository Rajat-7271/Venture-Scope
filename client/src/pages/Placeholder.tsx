import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-secondary/30 p-8 rounded-full mb-6">
          <Construction className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          This page is currently under construction. We're working hard to bring you new features!
        </p>
        <Link href="/">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </main>
    </div>
  );
}
