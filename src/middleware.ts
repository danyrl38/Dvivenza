import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// -----------------------------------------------------------------------------
// Protege el panel /admin con autenticación básica (usuario + contraseña).
// Define en Vercel:
//   ADMIN_PASSWORD   → contraseña del panel (obligatoria para habilitarlo)
//   ADMIN_USER       → usuario (opcional, por defecto "admin")
// Sin ADMIN_PASSWORD, el panel queda deshabilitado por seguridad.
// -----------------------------------------------------------------------------

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // Si no se ha configurado una contraseña, no exponemos el panel.
  if (!expectedPassword) {
    return new NextResponse(
      "Panel no configurado. Define la variable de entorno ADMIN_PASSWORD (y opcionalmente ADMIN_USER) en Vercel para habilitarlo.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice(6));
      const separator = decoded.indexOf(":");
      const user = decoded.slice(0, separator);
      const password = decoded.slice(separator + 1);
      if (user === expectedUser && password === expectedPassword) {
        return NextResponse.next();
      }
    } catch {
      // Cabecera malformada → cae al 401 de abajo.
    }
  }

  // Nota: el valor de WWW-Authenticate debe ser ASCII puro (sin acentos ni "—"),
  // de lo contrario la plataforma descarta la cabecera y el navegador no muestra
  // el cuadro de inicio de sesión.
  return new NextResponse("Autenticacion requerida.", {
    status: 401,
    headers: {
      "WWW-Authenticate": "Basic realm=\"D'Vivenza Panel\"",
    },
  });
}
