/** @format */
import "./globals.css";
import AutoReroute from "../AutoReroute";

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <AutoReroute />
    <link rel="manifest" href="/manifest.json" />
    <body className="bg-zinc-50 dark:bg-zinc-900">{children}</body>
  </html>
);

export default RootLayout;
