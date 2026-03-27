/* Contenedor de inventario: gestiona el estado de filtros (marca/año) con
   condicionamiento cruzado — cada filtro limita las opciones del otro según
   los vehículos disponibles que coincidan. */
import { useState, useMemo } from 'react';
import SearchFilters from '@/components/SearchFilters';
import InventoryCarousel from '@/components/InventoryCarousel';

/* Tipado compartido para los vehículos con imágenes */
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

interface InventoryGridProps {
  cars: Vehiculo[];
  marcas: string[];
  anios: number[];
}

export default function InventoryGrid({ cars }: InventoryGridProps) {
  /* Estado de los filtros seleccionados: null significa "todos" */
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string | null>(null);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);

  /* Marcas disponibles condicionadas al año seleccionado */
  const marcasDisponibles = useMemo(() => {
    const filtrados = anioSeleccionado
      ? cars.filter((c) => c.anio === anioSeleccionado)
      : cars;
    return [...new Set(filtrados.map((c) => c.marca.trim()))].sort();
  }, [cars, anioSeleccionado]);

  /* Años disponibles condicionados a la marca seleccionada */
  const aniosDisponibles = useMemo(() => {
    const filtrados = marcaSeleccionada
      ? cars.filter((c) => c.marca.trim().toLowerCase() === marcaSeleccionada)
      : cars;
    return [...new Set(filtrados.map((c) => c.anio))].sort((a, b) => b - a);
  }, [cars, marcaSeleccionada]);

  /* Vehículos filtrados por ambos criterios */
  const carsFiltrados = useMemo(() => {
    return cars.filter((car) => {
      const cumpleMarca = !marcaSeleccionada || car.marca.trim().toLowerCase() === marcaSeleccionada;
      const cumpleAnio = !anioSeleccionado || car.anio === anioSeleccionado;
      return cumpleMarca && cumpleAnio;
    });
  }, [cars, marcaSeleccionada, anioSeleccionado]);

  return (
    <>
      {/* Filtros con opciones condicionadas cruzadas */}
      <div className="mb-10">
        <SearchFilters
          marcas={marcasDisponibles}
          anios={aniosDisponibles}
          onMarcaChange={setMarcaSeleccionada}
          onAnioChange={setAnioSeleccionado}
        />
      </div>

      {/* Grilla vertical de vehículos filtrados */}
      <InventoryCarousel cars={carsFiltrados} />
    </>
  );
}
