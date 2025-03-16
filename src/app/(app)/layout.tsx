/** @format */

import NavBar from "@/components/navbar/navbar";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="p-4">{children}</div>
      <NavBar />
    </>
  );
}
