/* Grilla de inventario: tarjetas de vehículos con imagen estática.
   Al pulsar una card se abre un modal con carrusel de todas las imágenes.
   En mobile el modal ocupa 80% de pantalla con botón de cierre y cierre al pulsar fuera. */
import React, { useMemo, useState, useCallback, useEffect } from 'react';
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

/* Tarjeta de vehículo: muestra solo la primera imagen, al pulsar abre el modal */
const VehicleCard = React.memo(function VehicleCard({
  data,
  onOpen,
}: {
  data: CardData;
  onOpen: () => void;
}) {
  const firstImage = data.imagenes[0];
  const imageCount = data.imagenes.length;

  return (
    <div
      className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-background rounded-2xl sm:rounded-3xl h-full flex flex-col cursor-pointer"
      onClick={onOpen}
    >
      {/* Imagen principal del vehículo con etiqueta de carrocería */}
      <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center bg-primary/90 text-white font-bold px-3 py-1 rounded-lg backdrop-blur-sm text-xs">
            {data.carroceria}
          </span>
        </div>
        {/* Contador de imágenes en esquina inferior derecha */}
        {imageCount > 1 && (
          <div className="absolute bottom-3 right-3 z-20">
            <span className="inline-flex items-center gap-1 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              {imageCount}
            </span>
          </div>
        )}
        <img
          src={firstImage.image}
          alt={firstImage.alt ?? ''}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Información básica: marca, modelo y año */}
      <div className="p-4 sm:p-6 flex-1 flex items-center justify-center">
        <p className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-tight text-center">
          {data.nombre} · {data.anio}
        </p>
      </div>
    </div>
  );
});

/* Modal de galería: muestra el carrusel con todas las imágenes del vehículo.
   En mobile ocupa 80% de la pantalla; se cierra con botón X o pulsando fuera. */
function GalleryModal({
  data,
  onClose,
}: {
  data: CardData;
  onClose: () => void;
}) {
  /* Bloquea el scroll del body mientras el modal está abierto */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* Cierra con tecla Escape */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Contenedor del modal: 80% en mobile, max-width en desktop */}
      <div
        className="relative w-[96%] h-[85vh] sm:w-[70%] sm:h-[80vh] lg:w-[55%] lg:h-[85vh] bg-background rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre en esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
          aria-label="Cerrar galería"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Carrusel de imágenes centrado con fondo neutro, ocupa todo el espacio disponible */}
        <div className="w-full flex-1 relative bg-black/5 dark:bg-white/5 min-h-0">
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

        {/* Información del vehículo en la parte inferior */}
        <div className="p-4 sm:p-6 flex items-center justify-center border-t border-border/40">
          <p className="text-lg font-black uppercase tracking-tight text-center leading-tight">
            {data.nombre} · {data.anio}
          </p>
        </div>
      </div>
    </div>
  );
}

/* Componente principal: grilla vertical responsive de tarjetas de vehículos */
export default function InventoryCarousel({ cars }: InventoryCarouselProps) {
  const cardsData = useMemo(() => cars.map(prepararCardData), [cars]);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const handleOpen = useCallback((data: CardData) => setSelectedCard(data), []);
  const handleClose = useCallback(() => setSelectedCard(null), []);

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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {cardsData.map((data) => (
          <VehicleCard
            key={data.id}
            data={data}
            onOpen={() => handleOpen(data)}
          />
        ))}
      </div>

      {/* Modal de galería: se renderiza solo cuando hay una card seleccionada */}
      {selectedCard && (
        <GalleryModal data={selectedCard} onClose={handleClose} />
      )}
    </>
  );
}
