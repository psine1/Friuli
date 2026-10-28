import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Udine · Un pequeño mundo por descubrir', description: 'Explorá el corazón de Udine en una maqueta interactiva 3D.' };
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="es"><body style={{margin:0}}>{children}</body></html>}
