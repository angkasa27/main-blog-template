import { ThemeProvider } from "./theme-provider";
import { ConfirmProvider } from "@/hooks/use-confirm-dialog";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ThemeProvider>
  );
};
