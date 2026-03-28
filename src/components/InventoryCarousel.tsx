/* Grilla de inventario: muestra las tarjetas de vehículos en una grilla vertical responsive.
   Cada card incluye un carrusel draggable con todas las imágenes del vehículo,
   además de marca, modelo, año y etiqueta de carrocería.
   Cards memoizadas para evitar re-renders costosos al cambiar filtros. */
import React, { useMemo } from 'react';
import Carousel, { type CarouselItem } from './Carousel';

/* Tipado para los datos de vehículos que recibe el componente */
interface InventarioImagen {
  url: string;
  orden: number;
}

interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  color_exterior: string | null;
  transmision: string | null;
  combustible: string | null;
  millaje: number;
  carroceria: string | null;
  down_payment: number | null;
  inventario_imagenes: InventarioImagen[];
}

interface InventoryCarouselProps {
  cars: Vehiculo[];
}

/* Datos pre-computados para evitar cálculos en cada render */
interface CardData {
  id: string;
  nombre: string;
  imagenes: CarouselItem[];
  anio: number;
  carroceria: string;
}

/* Pre-computa los datos visibles de un vehículo para la card, incluyendo todas las imágenes */
function prepararCardData(car: Vehiculo): CardData {
  const nombre = `${car.marca.trim()} ${car.modelo.trim()}`;
  const sorted = [...car.inventario_imagenes].sort((a, b) => a.orden - b.orden);
  /* Filtra videos y construye items de carrusel con cada imagen */
  const imagenes: CarouselItem[] = sorted
    .filter((img) => !img.url.endsWith('.mp4'))
    .map((img, idx) => ({
      id: idx + 1,
      image: img.url,
      alt: `${nombre} - foto ${idx + 1}`,
    }));

  /* Si no hay imágenes, usa placeholder */
  if (imagenes.length === 0) {
    imagenes.push({ id: 1, image: '/placeholder-car.jpg', alt: nombre });
  }

  return {
    id: car.id,
    nombre,
    imagenes,
    anio: car.anio,
    carroceria: car.carroceria ?? 'Auto',
  };
}

/* Icono de auto para el estado vacío */
const CarIcon = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>;

/* Tarjeta de vehículo memoizada: carrusel de imágenes, etiqueta de carrocería, marca+modelo y año */
const VehicleCard = React.memo(function VehicleCard({ data }: { data: CardData }) {
  return (
    <div className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-background rounded-2xl sm:rounded-3xl h-full flex flex-col">
      {/* Carrusel de imágenes del vehículo con etiqueta de carrocería superpuesta */}
      <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center bg-primary/90 text-white font-bold px-3 py-1 rounded-lg backdrop-blur-sm text-xs">
            {data.carroceria}
          </span>
        </div>
        {/* Carrusel ocupa todo el contenedor de imagen */}
        <div className="w-full h-full">
          <Carousel
            items={data.imagenes}
            baseWidth={400}
            autoplay={false}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        </div>
      </div>

      {/* Información básica: marca, modelo y año en fila centrada */}
      <div className="p-4 sm:p-6 flex-1 flex items-center justify-center">
        <p className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-tight text-center">
          {data.nombre} · {data.anio}
        </p>
      </div>
    </div>
  );
});

/* Componente principal: grilla vertical responsive de tarjetas de vehículos */
export default function InventoryCarousel({ cars }: InventoryCarouselProps) {
  /* Pre-computa todos los datos una sola vez, no en cada render */
  const cardsData = useMemo(() => cars.map(prepararCardData), [cars]);

  if (cardsData.length === 0) {
    return (
      <div className="text-center py-16">
        {CarIcon}
        <p className="text-muted-foreground text-lg font-medium">
          No vehicles available at this time. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {cardsData.map((data) => (
        <VehicleCard key={data.id} data={data} />
      ))}
    </div>
  );
}
