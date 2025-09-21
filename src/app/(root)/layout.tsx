'use client'
import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@rainbow-me/rainbowkit/styles.css";
import ClearNodeProvider from "@/lib/provider/ClearNodeProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const iframeHeight = "800px";
const queryClient = new QueryClient();
export const description = "A sidebar with a header and a search form.";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>

          <ClearNodeProvider>
            <div className="[--header-height:calc(--spacing(14))]">
              <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                  <Toaster />
                  <AppSidebar />
                  <SidebarInset><div className="pt-12">{children}</div></SidebarInset>
                </div>
              </SidebarProvider>
            </div>
          </ClearNodeProvider>
      </QueryClientProvider>
    </>
  );
};
export default layout;
