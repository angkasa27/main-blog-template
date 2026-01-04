import { Sidebar } from "./sections/sidebar";
import { Header } from "./sections/header";

interface DashboardLayoutContainerProps {
  children: React.ReactNode;
}

export function DashboardLayoutContainer({ children }: DashboardLayoutContainerProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden pl-64">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
