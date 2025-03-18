/** @format */
import "./globals.css";

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body className="bg-zinc-50 dark:bg-zinc-900">{children}</body>
  </html>
);

export default RootLayout;
