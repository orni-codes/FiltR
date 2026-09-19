import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export const Route = createFileRoute("/_recruiter")({
  component: RecruiterLayout,
});

function RecruiterLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 h-auto w-full bg-foreground/15 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation backdrop"
        />
      )}

      <div className="lg:pl-60">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <Outlet />
      </div>
    </div>
  );
}
