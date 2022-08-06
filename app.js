import React from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import {GeoJsonLayer} from 'deck.gl';
import {MaskExtension} from '@deck.gl/extensions';
import {points} from './points';
import {ScatterplotLayer} from '@deck.gl/layers';

// const DATA_URL =
//   'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json'; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  latitude: 36,
  longitude: -5.4,
  zoom: 7,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

export default function App({
  data = points,
  intensity = 1,
  threshold = 0.05,
  radiusPixels = 30,
  mapStyle = MAP_STYLE
}) {
  const layers = [
    new GeoJsonLayer({
      id: 'geofence',
      getFillColor: [160, 160, 180, 200],
      data: {
        type: 'Feature',
        properties: {party: 'Republican'},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-4.41660023, 32],
              [-6.41660023, 37.1997986],
              [-2.99449992, 37.1997986],
              [-2.99449992, 32],
              [-4.41660023, 32]
            ]
          ]
        }
      },
      operation: 'mask'
    }),
    new HeatmapLayer({
      data,
      id: 'heatmp-layer',
      pickable: false,
      getPosition: d => [d[0], d[1]],
      getWeight: d => d[2],
      radiusPixels,
      intensity,
      threshold,
      extensions: [new MaskExtension()],
      maskId: 'geofence'
      // weightsTextureSize: 1000
    })
  ];

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers}>
      <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
    </DeckGL>
  );
}

export function renderToDOM(container) {
  render(<App />, container);
}
