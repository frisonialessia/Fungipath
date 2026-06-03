"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Revela su contenido al entrar en viewport (scroll-reveal editorial).
export default function Reveal({ children, delay = 0, as = "div", className = "" }: { children: ReactNode; delay?: number; as?: "div" | "section"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return <Tag ref={ref} className={`sr${seen ? " in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>;
}
