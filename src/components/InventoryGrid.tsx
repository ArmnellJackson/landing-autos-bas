/* Contenedor de inventario: gestiona el estado de filtros (marca/año) con
   condicionamiento cruzado y suscripción en tiempo real a Supabase para
   reflejar cambios en la base de datos sin recargar la página. */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
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

export default function InventoryGrid({ cars: carsIniciales }: InventoryGridProps) {
  /* Estado reactivo del inventario: inicia con datos del servidor y se actualiza en tiempo real */
  const [cars, setCars] = useState<Vehiculo[]>(carsIniciales);

  /* Estado de los filtros seleccionados: null significa "todos" */
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string | null>(null);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);

  /* Re-consulta el inventario completo desde Supabase cuando se detecta un cambio.
     Se usa una consulta completa porque los eventos Realtime no incluyen relaciones. */
  const refetchInventario = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('inventario')
      .select(`
        id, marca, modelo, anio, precio, color_exterior, transmision,
        combustible, millaje, carroceria, down_payment,
        inventario_imagenes ( url, orden )
      `)
      .eq('status', 'disponible')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCars(data as Vehiculo[]);
    }
  }, []);

  /* Suscripción a cambios en tiempo real de las tablas inventario e inventario_imagenes.
     Escucha INSERT, UPDATE y DELETE para mantener la grilla sincronizada con la BD. */
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel('inventario-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventario' },
        () => refetchInventario()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventario_imagenes' },
        () => refetchInventario()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchInventario]);

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
      <div className="mb-5">
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
