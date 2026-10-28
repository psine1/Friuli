# Friuli · Udine en miniatura

Experiencia local en Next.js App Router, React, TypeScript y Three.js mediante Fiber/Drei. Se conserva la API reutilizable, la interfaz editorial y las interacciones. Esta versión amplía la maqueta a seis destinos de Udine y sustituye los modelos iniciales por arquitectura procedural más detallada. No es una reconstrucción arquitectónica exacta.

## Ejecutar y validar

Node.js 22.18 o superior compatible con Next 16. Usar npm y conservar `package-lock.json`.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm start
node --experimental-strip-types --test tests/coordinates.test.mjs
node --test tests/architecture.test.mjs
```

Demo: http://127.0.0.1:3000. `/embedded` conserva la prueba de integración en una sección de 520 px. El componente necesita un contenedor con altura definida; mínimo recomendado 460 px.

## Qué incluye

- Castello: palacio alargado, ventanas por niveles, óculos, cubierta de caballete y doble escalera del patio norte.
- Lionello: tres lados abiertos, arcos apuntados, columnas, bandas de piedra, ventanas superiores recortadas, balcón y piso ajedrezado.
- Duomo: fachada escalonada de ladrillo, tres portales, rosetón y dos óculos, nave/laterales y campanario octogonal sin aguja.
- Torre dell’Orologio / Loggia di San Giovanni: arcadas, arco central, reloj azul y dorado, dos figuras y campana.
- Piazza San Giacomo / Matteotti: fuente, columna e iglesia/capilla con reloj, balcón y campanario abierto.
- Lippomano: tramo abreviado de pórtico gótico y escalones ascendentes conectados con la colina.

La colina forma parte de una superficie continua con cima aplanada. Hay plazas, calles conectadas, manzanas de distintas alturas, patios y pórticos secundarios. La selección sigue disponible desde modelo, marcador y lista HTML, con vuelta a vista general incluso después de orbitar. Cada lugar tiene su propio encuadre. En selección se ocultan los demás marcadores y se compacta el título. En celular la lista es desplazable horizontalmente y la ficha tiene altura limitada.

## Integración en otro Next.js

Copiar `src/features/friuli-explorer`. Instalar las versiones de `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei` y `@types/three` del package.json / lockfile. No se incorporaron dependencias nuevas. No hay recursos públicos externos que trasladar: los modelos son geometría original.

```tsx
import { FriuliExplorer, places } from '@/features/friuli-explorer';
export default function Page() {
  return <div style={{ height: 620 }}>
    <FriuliExplorer places={places} initialPlaceId="san-giovanni"
      assetBasePath="/friuli-explorer" />
  </div>;
}
```

Se mantienen `className`, `style`, `onPlaceSelect(place | null)` y `onPlaceOpen(place)`. Para callbacks usar un wrapper con `'use client'`; no pasar funciones desde un Server Component. El anfitrión decide cómo abrir el destino. Sin callback, la acción abre la fuente del lugar en otra pestaña. La selección inicial se aplica al montar; cambiar la key para reinicializar. Todos los datos públicos son serializables.

## Arquitectura y extensión

- `FriuliExplorer.tsx`: interfaz, selección y límite cliente. La escena usa dynamic con ssr:false.
- `scene/`: selección 3D, marcadores y cámara responsive con movimiento reducido.
- `models/architecture.ts`: primitivas y geometrías de arcos/aberturas; combina geometría estática por material.
- `models/Castello.ts`, `Lionello.ts`, `Duomo.ts`, `SanGiovanni.ts`, `CityDestinations.ts`: constructores independientes. `Monument.tsx` los registra.
- `models/Landscape.tsx`: terreno continuo y contexto urbano; `ArchitecturalMesh.tsx` materializa los lotes y libera geometrías.
- `data/places.ts`: coordenadas, posiciones artísticas, rotaciones, cámaras, marcadores y contenido.
- `data/sceneConfig.ts`: origen, vista general y configuración territorial exclusiva de Udine.
- `utils/coordinates.ts`: proyección local (30 metros por unidad) para destinos sin posición artística.

Cada `Place` admite `scenePosition`, `sceneRotation`, `markerOffset` y `camera: { offset, targetOffset }`. Los tres vectores de cámara/marcador usan ejes de mundo relativos a la posición del destino, no al giro del modelo. Conservar las coordenadas reales al ajustar la composición.

Para un nuevo edificio añadir su identificador a `Landmark` y registrar su constructor en `Monument.tsx`. Para una localidad futura como Cividale o Venzone, crear otra configuración y otro paisaje/escena, seleccionados desde un nivel superior: no colocar esos destinos en el paisaje urbano de Udine.

## Sustituir por GLB

Añadir `modelPath: 'models/castello.glb'` al destino y colocar el archivo en `public/friuli-explorer/models/castello.glb`. `assetBasePath` resuelve la carpeta base. El GLB necesita eje Y arriba, origen al nivel del suelo y unidades compatibles con la maqueta; la rotación se configura en el dato. Mantener cámara y marcador como ajustes independientes. La selección no cambia. El adaptador clona la escena por instancia y conserva la caché GLTF. Documentar licencia, origen y optimización de cualquier recurso añadido.

## Rendimiento y comprobaciones

Renderizado a demanda, DPR hasta 1.5, un mapa de sombras de 1024, sin postprocesado ni animaciones continuas. La geometría estática se fusiona por acabado; las ventanas, columnas y bancos no añaden un draw call por pieza. Los tests ponen un techo de 12 lotes y 30.000 triángulos por monumento y comprueban con rayos que las arcadas no estén tapadas por cajas. Las pruebas no sustituyen un perfil en un celular real.

Los estilos están encapsulados en CSS Modules; los paneles respetan el contenedor. No se modifican estilos globales ni se agregan listeners de navegación globales. La alternativa HTML continúa disponible sin WebGL.

Tipos, lint, build y pruebas se ejecutan durante la entrega. La comprobación visual de escritorio/celular no pudo completarse: no había navegador conectado y la autorización de control de la ventana nativa de Chrome venció. Quedan pendientes la revisión visual de todos los encuadres, gestos, rendimiento real y consola tras una recarga limpia. El servidor de desarrollo preexistente se conservó.

## Fuentes, atribuciones y límites

Ver [SOURCES.md](SOURCES.md) para fotografías consultadas, fuentes institucionales, ubicaciones y limitaciones por modelo. Las fotografías son solo referencias de consulta y no se redistribuyen en la demo. Las coordenadas son orientativas y la escala, las pendientes y las distancias son artísticas. Porta Aquileia quedó evaluada para una próxima extensión al sur. No se publicó, desplegó ni hizo push.
