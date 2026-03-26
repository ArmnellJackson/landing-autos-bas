/* Filtros de búsqueda del Hero: selectores de marca, ubicación y año con botón de búsqueda. */
import { Search, MapPin, Calendar, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchFilters() {
  return (
    <div className="bg-background rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-border/50 p-2 max-w-5xl mx-auto">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Selector de marca */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Car Brand</label>
            <Select>
              <SelectTrigger className="h-12 bg-muted/30 border-none rounded-xl focus:ring-primary/20">
                <div className="flex items-center gap-3">
                  <Car size={18} className="text-primary" />
                  <SelectValue placeholder="Select Brand" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rolls">Rolls Royce</SelectItem>
                <SelectItem value="bentley">Bentley</SelectItem>
                <SelectItem value="ferrari">Ferrari</SelectItem>
                <SelectItem value="porsche">Porsche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selector de ubicación */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Location</label>
            <Select>
              <SelectTrigger className="h-12 bg-muted/30 border-none rounded-xl focus:ring-primary/20">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary" />
                  <SelectValue placeholder="Miami, FL" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="miami">Miami, FL</SelectItem>
                <SelectItem value="ft-lauderdale">Ft. Lauderdale, FL</SelectItem>
                <SelectItem value="palm-beach">Palm Beach, FL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selector de año */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Model Year</label>
            <Select>
              <SelectTrigger className="h-12 bg-muted/30 border-none rounded-xl focus:ring-primary/20">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-primary" />
                  <SelectValue placeholder="2024 - 2026" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón de búsqueda */}
          <div className="flex items-end">
            <Button className="w-full h-12 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2">
              <Search size={18} />
              Search Cars
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
