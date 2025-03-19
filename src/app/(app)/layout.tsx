/** @format */

import NavBar from "@/components/navbar/navbar";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-24">{children}</div>
      <NavBar />
    </>
  );
}
