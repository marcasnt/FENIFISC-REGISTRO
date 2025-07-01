"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Permitir acceso libre solo a /admin/login
    if (pathname === "/admin/login") return;
    // Simulación: si no hay sesión en localStorage, redirigir a login
    if (typeof window !== "undefined" && !localStorage.getItem("fenifisc_admin")) {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
} 