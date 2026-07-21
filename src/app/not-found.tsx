import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="eyebrow">Error 404</span>
      <h1 className="mt-4 font-serif text-6xl font-medium text-chocolate md:text-7xl">
        Página no encontrada
      </h1>
      <p className="mt-5 max-w-md text-pretty text-lg text-cafe">
        La página que buscas no existe o fue movida. Volvamos a crear algo hermoso.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/">Volver al inicio</Button>
        <Button href="/pedido" variant="secondary">
          Crear mi obra
        </Button>
      </div>
    </div>
  );
}
