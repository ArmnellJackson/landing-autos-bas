/* Carrusel reutilizable basado en motion/react con soporte para imágenes.
   Permite arrastrar (drag), autoplay, loop infinito y renderizado condicional
   de imágenes o contenido genérico (icono + texto). */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';

/* Tipo para la info de drag que provee motion al finalizar el gesto */
interface PanInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}
import React from 'react';

/* Interfaz de cada item del carrusel: puede ser imagen o contenido genérico */
export interface CarouselItem {
  id: number;
  /* Campos opcionales para modo imagen */
  image?: string;
  alt?: string;
  /* Campos opcionales para modo genérico (icono + texto) */
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItem;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: any;
  transition: any;
}

/* Renderizado individual de cada slide: imagen o contenido genérico según los campos del item */
function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }: CarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  /* Modo imagen: renderiza la foto a tamaño completo sin padding */
  const esImagen = !!item.image;

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`relative shrink-0 flex flex-col ${
        esImagen
          ? 'items-center justify-center rounded-[12px]'
          : round
            ? 'items-center justify-center text-center bg-[#060010] border-0'
            : 'items-start justify-between bg-[#222] border border-[#222] rounded-[12px]'
      } overflow-hidden cursor-grab active:cursor-grabbing`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY: rotateY,
        ...(round && { borderRadius: '50%' })
      }}
      transition={transition}
    >
      {esImagen ? (
        /* Imagen del vehículo ocupando todo el slide */
        <img
          src={item.image}
          alt={item.alt ?? ''}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        /* Contenido genérico: icono + título + descripción */
        <>
          <div className={`${round ? 'p-0 m-0' : 'mb-4 p-5'}`}>
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#060010]">
              {item.icon}
            </span>
          </div>
          <div className="p-5">
            <div className="mb-1 font-black text-lg text-white">{item.title}</div>
            <p className="text-sm text-white">{item.description}</p>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}: CarouselProps) {
  /* Detecta si todos los items son imágenes para modo fullwidth */
  const modoImagen = items.length > 0 && items.every((item) => !!item.image);

  /* En modo imagen, mide el ancho real del contenedor para centrar las slides */
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(0);

  useEffect(() => {
    if (!modoImagen || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setMeasuredWidth(w);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [modoImagen]);

  /* Ancho efectivo: en modo imagen usa el ancho medido del contenedor, sino el baseWidth con padding */
  const containerPadding = modoImagen ? 0 : 16;
  const effectiveWidth = modoImagen && measuredWidth > 0 ? measuredWidth : baseWidth;
  const itemWidth = effectiveWidth - containerPadding * 2;
  const effectiveGap = modoImagen ? 0 : GAP;
  const trackItemOffset = itemWidth + effectiveGap;
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  const activeIndex =
    items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  /* Navegación manual: avanzar y retroceder */
  const goPrev = () => {
    setPosition((prev) => {
      const next = prev - 1;
      return loop ? Math.max(0, next) : Math.max(0, next);
    });
  };

  const goNext = () => {
    setPosition((prev) => {
      const next = prev + 1;
      const max = itemsForRender.length - 1;
      return Math.min(next, max);
    });
  };

  return (
    <div
      ref={containerRef}
      className={`group/carousel relative overflow-hidden ${
        modoImagen
          ? 'w-full h-full p-0'
          : `p-4 ${round ? 'rounded-full border border-white' : 'rounded-[24px] border border-[#222]'}`
      }`}
      style={{
        ...(!modoImagen && { width: `${baseWidth}px` }),
        ...(round && { height: `${baseWidth}px` })
      }}
    >
      <motion.div
        className="flex h-full"
        drag={isAnimating ? false : 'x'}
        {...dragProps}
        style={{
          width: modoImagen ? '100%' : itemWidth,
          gap: `${effectiveGap}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>

      {/* Flechas de navegación: visibles solo en desktop (lg+) al hacer hover */}
      {modoImagen && items.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            aria-label="Imagen anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={goNext}
            className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            aria-label="Imagen siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </>
      )}

      {/* Indicadores (dots): posicionados sobre la imagen en modo imagen, debajo en modo normal */}
      <div className={`flex w-full justify-center ${
        modoImagen
          ? 'absolute z-20 bottom-2 left-1/2 -translate-x-1/2'
          : round
            ? 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2'
            : ''
      }`}>
        <div className={`flex gap-1.5 ${modoImagen ? '' : 'mt-4 w-[150px] justify-between px-8'}`}>
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                activeIndex === index
                  ? modoImagen
                    ? 'bg-white'
                    : round
                      ? 'bg-white'
                      : 'bg-[#333333]'
                  : modoImagen
                    ? 'bg-white/50'
                    : round
                      ? 'bg-[#555]'
                      : 'bg-[rgba(51,51,51,0.4)]'
              }`}
              animate={{
                scale: activeIndex === index ? 1.2 : 1
              }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
