/* Filtros de búsqueda del inventario: selectores dinámicos de marca y año
   que emiten cambios al componente padre para filtrar el carrusel. */
import { Calendar, Car } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  marcas: string[];
  anios: number[];
  onMarcaChange: (marca: string | null) => void;
  onAnioChange: (anio: number | null) => void;
}

export default function SearchFilters({ marcas, anios, onMarcaChange, onAnioChange }: SearchFiltersProps) {
  return (
    <div className="bg-background rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-border/50 p-2 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
        {/* Selector de marca: opciones dinámicas desde el inventario */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Car Brand</label>
          <Select onValueChange={(val) => onMarcaChange(val === 'all' ? null : val)}>
            <SelectTrigger className="h-12 bg-muted/30 border-none rounded-xl focus:ring-primary/20">
              <div className="flex items-center gap-3">
                <Car size={18} className="text-primary" />
                <SelectValue placeholder="All Brands" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {marcas.map((marca) => (
                <SelectItem key={marca} value={marca.toLowerCase()}>
                  {marca}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector de año: opciones dinámicas desde el inventario */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Model Year</label>
          <Select onValueChange={(val) => onAnioChange(val === 'all' ? null : Number(val))}>
            <SelectTrigger className="h-12 bg-muted/30 border-none rounded-xl focus:ring-primary/20">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-primary" />
                <SelectValue placeholder="All Years" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {anios.map((anio) => (
                <SelectItem key={anio} value={String(anio)}>
                  {anio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
