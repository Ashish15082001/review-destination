import { ReactNode } from "react";

export default function ReviewLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  console.log("[id]/layout.tsx");

  return (
    <div className="review-layout">
      {children}
      {modal}
    </div>
  );
}
