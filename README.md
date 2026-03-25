# Autos Bas Dealer Miami - Landing Page

Proyecto de landing page de alta gama para un concesionario de vehículos de lujo en Miami, desarrollado con **Astro**, **Tailwind CSS v4** y **shadcn/ui**.

## 🚀 Tecnologías y Herramientas
- **Astro**: Framework principal para una entrega de contenido rápida y eficiente.
- **Tailwind CSS v4**: Sistema de diseño con configuración nativa mediante CSS variables y OKLCH.
- **shadcn/ui**: Componentes de interfaz accesibles y altamente personalizables.
- **Lucide React**: Biblioteca de iconos modernos y coherentes.

## 🎨 Diseño y Estética
El diseño se basa en una referencia de Dribbble con las siguientes características:
- **Paleta de Colores**: Fondo blanco limpio, secciones oscuras profundas (#1A1A1A) y acentos en rojo vibrante (#E31B23) para CTAs y elementos clave.
- **Tipografía**: Jerarquía potente con títulos en pesos Bold/Black para transmitir potencia y exclusividad.
- **Componentes**: Hero dinámico, barra de filtros avanzada, catálogo de inventario detallado y sección de valor asimétrica.

## 🛠️ Log de Errores y Resoluciones
- **Error de Contexto en React**: Los componentes de Radix UI (`Select`, `Tabs`) fallaban durante el build al ser renderizados de forma individual en Astro.
  - *Resolución*: Se encapsularon los filtros de búsqueda en un único componente de React (`SearchFilters.tsx`) y se utilizó la directiva `client:load` para asegurar la hidratación del contexto en el cliente.
- **Iconos de Redes Sociales**: La versión de `lucide-react` presentaba problemas de exportación para iconos sociales específicos en entorno ESM.
  - *Resolución*: Se sustituyeron por iconos genéricos (`Globe`, `Message`, `User`) para garantizar la estabilidad del build sin comprometer la funcionalidad.

## 📦 Comandos Disponibles
```bash
pnpm dev    # Iniciar servidor de desarrollo
pnpm build  # Generar build de producción
```
