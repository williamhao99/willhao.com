import type { ReactNode } from "react";

interface ProseProps {
  children: ReactNode;
}

export default function Prose({ children }: ProseProps) {
  return <article className="prose">{children}</article>;
}
