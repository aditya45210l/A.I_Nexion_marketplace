import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import WebsokcketProvider from "@/lib/provider/websokcketProvider";
import { Toaster } from "@/components/ui/sonner";

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

const layout = ({ children }: { children: ReactNode }) => {
  return    <WebsokcketProvider>
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <Toaster />
          <AppSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
    </WebsokcketProvider>
};
export default layout;

