import { useEffect, useState, type ReactNode } from "react";

export function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

/** Renders children only in the browser when WebGL exists; otherwise the fallback. */
export function Client3D({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const ok = useWebGL();
  if (ok === null) return null;
  return <>{ok ? children : fallback}</>;
}
