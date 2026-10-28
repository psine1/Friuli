import type { Place } from '../types';

// Approximate geographic centers, not navigation coordinates. Scene positions are artistic.
export const places: Place[] = [
  {
    id: 'udine-castle', name: 'Castello di Udine', eyebrow: '01 · SOBRE LA COLINA',
    description: 'Sobre la colina se alza el palacio renacentista que alberga los Museos Cívicos. En su patio norte, la doble escalera exterior conduce al gran salón del castillo.',
    coordinates: { latitude: 46.0642, longitude: 13.2352 },
    scenePosition: [0, 2.46, -9], markerOffset: [0, 5.3, -.2],
    camera: { offset: [-10, 7, -13], targetOffset: [0, 1.8, -.7] },
    model: 'castle', sourceUrl: 'https://www.civicimuseiudine.it/it/musei-civici-del-castello/il-castello',
  },
  {
    id: 'piazza-liberta', name: 'Piazza della Libertà', eyebrow: '02 · LOGGIA DEL LIONELLO',
    description: 'La Loggia del Lionello mira hacia el castillo. Sus bandas de piedra blanca y rosada, las ventanas góticas y el pórtico abierto definen uno de los lugares más reconocibles de Udine.',
    coordinates: { latitude: 46.0632, longitude: 13.235 },
    scenePosition: [-1.2, .08, 1.4], sceneRotation: Math.PI,
    markerOffset: [-2.3, 4.65, 0],
    camera: { offset: [8, 6, -10], targetOffset: [0, 1.9, 0] },
    model: 'loggia', sourceUrl: 'https://www.italia.it/it/friuli-venezia-giulia/udine/piazza-della-liberta',
  },
  {
    id: 'udine-duomo', name: 'Duomo di Udine', eyebrow: '03 · LADRILLO Y PIEDRA',
    description: 'La fachada de ladrillo conserva el carácter románico y gótico de la catedral, con el Portal de la Redención como protagonista. A su lado se levanta el ancho campanario, cuyo proyecto quedó sin completar.',
    coordinates: { latitude: 46.0615, longitude: 13.2368 },
    scenePosition: [5.9, .08, 7], sceneRotation: -Math.PI / 2,
    markerOffset: [0, 4.95, -.4],
    camera: { offset: [-12, 7.5, -9], targetOffset: [-.3, 1.8, 0] },
    model: 'duomo', sourceUrl: 'https://www.turismofvg.it/monumenti-religiosi/duomo-di-udine',
  },
  {
    id: 'san-giovanni', name: 'Torre dell’Orologio', eyebrow: '04 · LOGGIA DI SAN GIOVANNI',
    description: 'Frente al Lionello, la Loggia di San Giovanni combina arcadas renacentistas con un gran arco central. Sobre el reloj, dos figuras de bronce acompañan la campana que marca el tiempo de la plaza.',
    coordinates: { latitude: 46.06355, longitude: 13.2359 },
    scenePosition: [0, .08, -3.15], markerOffset: [-1.65, 6.6, -.2],
    camera: { offset: [10, 7, 13], targetOffset: [-.5, 2.5, 0] },
    model: 'san-giovanni', sourceUrl: 'https://www.storiapatriafriuli.org/Archivi/DPTZ/ALL/0000/568A.pdf',
  },
  {
    id: 'piazza-san-giacomo', name: 'Piazza San Giacomo', eyebrow: '05 · PIAZZA GIACOMO MATTEOTTI',
    description: 'También llamada Piazza Matteotti o Piazza delle Erbe, esta antigua plaza de mercado reúne la fuente de Giovanni da Udine, la columna de la Madonna y la iglesia de San Giacomo, entre fachadas y cafés.',
    coordinates: { latitude: 46.06285, longitude: 13.23289 },
    scenePosition: [-8.2, .08, 3.1], sceneRotation: Math.PI / 2,
    markerOffset: [-.1, 5.3, .8],
    camera: { offset: [10, 7, 10], targetOffset: [.8, 1.7, 0] },
    model: 'san-giacomo', sourceUrl: 'https://www.comune.udine.it/Vivere-il-comune/Luoghi/Piazza-Giacomo-Matteotti',
  },
  {
    id: 'loggia-lippomano', name: 'Loggia del Lippomano', eyebrow: '06 · LA SUBIDA AL CASTILLO',
    description: 'Un pórtico de arcos góticos acompaña la subida desde Piazza della Libertà hacia el castillo. El recorrido cubierto del Lippomano forma parte de la experiencia de llegar a la colina.',
    coordinates: { latitude: 46.06403, longitude: 13.23635 },
    scenePosition: [5.55, .12, -6.5], sceneRotation: Math.PI / 2,
    markerOffset: [.6, 3.7, .25],
    camera: { offset: [10, 6, 7], targetOffset: [.5, 1.4, -.3] },
    model: 'lippomano', sourceUrl: 'https://www.turismofvg.it/ProxyVFS.axd/null/r354145',
  },
];
