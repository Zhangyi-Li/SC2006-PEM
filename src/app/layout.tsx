/** @format */
import "./globals.css";
import AutoReroute from "../AutoReroute";
import { Toaster } from "@/components/ui/sonner";

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <link rel="manifest" href="/manifest.json" />
    <body className="bg-zinc-50 dark:bg-zinc-900">
      <AutoReroute />
      {children}
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
