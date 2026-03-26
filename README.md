# Autos Bas Dealer Miami - Landing Page

Landing page para un concesionario de vehiculos de lujo en Miami, desarrollada con Astro, Tailwind CSS v4 y componentes basados en shadcn/ui.

## Tecnologias y Herramientas
- Astro para la composicion de paginas y el build estatico.
- Tailwind CSS v4 con tokens en CSS variables y paleta OKLCH.
- shadcn/ui y Radix UI para componentes accesibles e interactivos.
- React para la hidratacion puntual de componentes con estado.
- Lucide React para iconografia consistente.

## Diseno y Estetica
- Direccion visual premium con contraste entre fondos claros, secciones oscuras y acentos rojos.
- Tipografia Geist Variable para jerarquia marcada y lectura limpia.
- Estructura enfocada en hero, filtros de busqueda, catalogo e informacion de valor.

## Comandos Disponibles
```bash
pnpm dev
pnpm build
```

## Log de Errores
- Error de contexto en React: componentes de Radix UI como Select y Tabs fallaban durante el build al renderizarse fuera de un arbol hidratado.
  Resolucion tecnica: se agruparon los filtros interactivos en un componente React y se uso hidratacion en cliente para preservar el contexto.
- Error de iconos en lucide-react: algunos iconos sociales presentaban incompatibilidades de exportacion en entorno ESM.
  Resolucion tecnica: se reemplazaron por iconos compatibles con el bundle actual.
- Error de resolucion de imports CSS externos: Vite no podia resolver `@import "tw-animate-css"` ni `@import "shadcn/tailwind.css"` desde `src/styles/global.css`.
  Resolucion tecnica: se eliminaron ambos imports no resolubles y se implementaron utilidades locales de animacion para `animate-in`, `animate-out`, `fade-in-0`, `fade-out-0`, `zoom-in-95`, `zoom-out-95` y desplazamientos usados por shadcn/ui.
