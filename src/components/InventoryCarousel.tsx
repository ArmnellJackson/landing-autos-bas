/* Carrusel de inventario: muestra las tarjetas de vehículos en un carrusel horizontal
   usando el componente Carousel de shadcn/ui (Embla). Recibe los datos serializados
   desde el componente Astro padre y renderiza cards de altura uniforme. */
import { Fuel, Gauge, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

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

/* Obtiene la primera imagen válida (excluye videos .mp4) para la miniatura */
function getImagenPrincipal(imagenes: InventarioImagen[]): string {
  const sorted = [...imagenes].sort((a, b) => a.orden - b.orden);
  const imagen = sorted.find((img) => !img.url.endsWith('.mp4'));
  return imagen?.url ?? '/placeholder-car.jpg';
}

/* Formatea el precio numérico a formato moneda USD */
function formatPrecio(precio: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(precio);
}

/* Mapas de traducción para mostrar en la UI */
const combustibleMap: Record<string, string> = {
  gasolina: 'Gasoline',
  diesel: 'Diesel',
  electrico: 'Electric',
  hibrido: 'Hybrid',
  flex: 'Flex',
};

const transmisionMap: Record<string, string> = {
  automatica: 'Auto',
  manual: 'Manual',
  cvt: 'CVT',
};

/* Genera la URL de WhatsApp con las características específicas del vehículo */
function getWhatsAppUrl(car: Vehiculo): string {
  const nombre = `${car.marca.trim()} ${car.modelo.trim()}`;
  const msg = encodeURIComponent(
    `Hello! I'm interested in the ${car.anio} ${nombre} (${car.color_exterior ?? 'N/A'}) listed at ${formatPrecio(car.precio)} on your website. Could you please provide more details about this vehicle? Thank you!`
  );
  return `https://wa.me/51929438206?text=${msg}`;
}

/* Componente principal: carrusel horizontal con tarjetas de vehículos de altura uniforme */
export default function InventoryCarousel({ cars }: InventoryCarouselProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-16">
        <Car size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg font-medium">
          No vehicles available at this time. Check back soon!
        </p>
      </div>
    );
  }

  return (
    /* Carrusel con loop infinito, alineación al inicio y visualización de múltiples slides */
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-6">
        {cars.map((car) => {
          const imagenUrl = getImagenPrincipal(car.inventario_imagenes);
          const nombre = `${car.marca.trim()} ${car.modelo.trim()}`;

          return (
            /* Cada slide ocupa 100% en mobile, 50% en tablet, 33% en desktop */
            <CarouselItem
              key={car.id}
              className="pl-6 basis-full md:basis-1/2 lg:basis-1/3"
            >
              {/* Card con altura fija y distribución flex para uniformidad */}
              <Card className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-background rounded-3xl h-full flex flex-col">
                {/* Imagen del vehículo con altura fija */}
                <CardHeader className="p-0 relative h-56 overflow-hidden shrink-0">
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-primary/90 hover:bg-primary text-white font-bold px-3 py-1 rounded-lg backdrop-blur-sm">
                      {car.carroceria ?? 'Auto'}
                    </Badge>
                  </div>
                  <img
                    src={imagenUrl}
                    alt={nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </CardHeader>

                {/* Contenido con flex-grow para ocupar el espacio restante */}
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {nombre}
                    </h3>
                    <span className="text-lg font-black text-primary italic whitespace-nowrap ml-2">
                      {formatPrecio(car.precio)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mb-4">
                    {car.anio} · {car.color_exterior ?? 'N/A'} ·{' '}
                    {car.millaje.toLocaleString('en-US')} mi
                  </p>

                  {/* Especificaciones del vehículo en grilla de 3 columnas */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50 mt-auto">
                    <div className="flex flex-col items-center gap-1">
                      <Car size={18} className="text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {car.millaje.toLocaleString('en-US')} mi
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-border/50">
                      <Gauge size={18} className="text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {transmisionMap[car.transmision ?? ''] ?? 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Fuel size={18} className="text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {combustibleMap[car.combustible ?? ''] ?? 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Down payment si está disponible */}
                  {car.down_payment && (
                    <p className="text-xs text-center text-primary font-bold mt-3">
                      Down Payment from {formatPrecio(car.down_payment)}
                    </p>
                  )}
                </CardContent>

                {/* Botón de WhatsApp fijado al fondo de la card */}
                <CardFooter className="p-6 pt-0 mt-auto shrink-0">
                  <a
                    href={getWhatsAppUrl(car)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl font-bold uppercase tracking-widest h-12 shadow-lg shadow-primary/10 bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Buy Now
                  </a>
                </CardFooter>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {/* Botones de navegación del carrusel */}
      <CarouselPrevious className="hidden md:inline-flex -left-4 lg:-left-6 size-10 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-white" />
      <CarouselNext className="hidden md:inline-flex -right-4 lg:-right-6 size-10 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-white" />
    </Carousel>
  );
}
