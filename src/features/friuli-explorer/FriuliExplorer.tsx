'use client';
import dynamic from 'next/dynamic';
import { Component, useState } from 'react';
import type { ReactNode } from 'react';
import { useCapabilities } from './utils/useCapabilities';
import type { FriuliExplorerProps, Place } from './types';
import { places as defaultPlaces } from './data/places';
import styles from './FriuliExplorer.module.css';

const Scene = dynamic(() => import('./scene/Scene'), {
  ssr: false,
  loading: () => <div className={styles.status}>Preparando tu pequeño viaje…</div>,
});

class SceneBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(error: Error) { console.error('Friuli Explorer:', error); }
  render() {
    return this.state.error
      ? <div className={styles.status}>La escena no pudo cargarse. Podés seguir explorando los lugares desde la lista.</div>
      : this.props.children;
  }
}

export function FriuliExplorer({ places = defaultPlaces, assetBasePath = '/friuli-explorer',
  initialPlaceId, className = '', style, onPlaceSelect, onPlaceOpen }: FriuliExplorerProps) {
  const [viewRevision, setViewRevision] = useState(0);
  const [selectedId, setSelectedId] = useState(initialPlaceId ?? null);
  const selected = places.find(place => place.id === selectedId) ?? null;
  const { webgl, reduced } = useCapabilities();
  const select = (place: Place | null) => {
    setSelectedId(place?.id ?? null);
    setViewRevision(value => value + 1);
    onPlaceSelect?.(place);
  };

  return <section className={`${styles.explorer} ${selected ? styles.selectedView : ''} ${className}`}
    style={style} aria-label="Explorador 3D de Udine">
    <div className={styles.scene}>
      {webgl === true ? <SceneBoundary>
        <Scene places={places} selected={selected} onSelect={select} reduced={reduced}
          assetBasePath={assetBasePath} viewRevision={viewRevision} />
      </SceneBoundary> : <div className={styles.status}>
        {webgl === null ? 'Preparando la experiencia…' : 'WebGL no está disponible. Descubrí Udine con la lista de lugares.'}
      </div>}
    </div>
    <header className={styles.header}>
      <a className={styles.brand} href="#" onClick={event => { event.preventDefault(); select(null); }}
        aria-label="Friuli, vista general">friuli<span>DA SCOPRIRE</span></a>
      <span className={styles.region}>ITALIA / 46° N, 13° E</span>
    </header>
    <div className={styles.intro}>
      <span className={styles.kicker}>UN PEQUEÑO MUNDO POR DESCUBRIR</span>
      <h1>Todos los caminos<br />llevan a <em>Udine.</em></h1>
      <p>Acercate. Mirá de nuevo.<br />El corazón de Friuli tiene mucho que contar.</p>
    </div>
    <nav className={styles.destinations} aria-label="Lugares de Udine">
      {places.map((place, i) => <button key={place.id} aria-pressed={selected?.id === place.id}
        className={selected?.id === place.id ? styles.selected : ''} onClick={() => select(place)}>
        <span>{String(i + 1).padStart(2, '0')}</span>{place.name}<span className={styles.arrow}>↗</span>
      </button>)}
    </nav>
    {selected && <article className={styles.card} aria-live="polite">
      <button className={styles.close} onClick={() => select(null)} aria-label="Cerrar ficha y volver a vista general">×</button>
      <span className={styles.kicker}>{selected.eyebrow}</span>
      <h2>{selected.name}</h2>
      <p>{selected.description}</p>
      {onPlaceOpen
        ? <button className={styles.open} onClick={() => onPlaceOpen(selected)}>Descubrir este lugar ↗</button>
        : <a className={styles.open} href={selected.sourceUrl} target="_blank" rel="noreferrer">Descubrir este lugar ↗</a>}
    </article>}
    <div className={styles.controls}>
      <button onClick={() => select(null)} title="Volver a la vista general">↺ <span>Vista general</span></button>
    </div>
    <footer className={styles.footer}>
      <span><i /> UDINE, FRIULI VENEZIA GIULIA</span>
      <span>Arrastrá para girar · Deslizá para acercarte</span>
      <span>Maqueta ilustrada · Escala artística</span>
    </footer>
  </section>;
}
