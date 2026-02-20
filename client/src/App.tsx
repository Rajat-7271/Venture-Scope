import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Placeholder from "@/pages/Placeholder";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      
      {/* Placeholder Routes for Nav Items */}
      <Route path="/analytics">
        <Placeholder title="Analytics" />
      </Route>
      <Route path="/customers">
        <Placeholder title="Customers" />
      </Route>
      <Route path="/notifications">
        <Placeholder title="Notifications" />
      </Route>
      <Route path="/settings">
        <Placeholder title="Settings" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
