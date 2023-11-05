import { GeoJsonLayer } from '@deck.gl/layers/typed';
import { useMemo } from 'react';
import * as turf from '@turf/turf';

// cs2 map tile: 0.62328571428x0.62328571428km
// cs2 tiles: 21x21 = 441 tiles
const TILE_LENGTH_KM = 0.62328571428;
const TILE_COUNT = 21;

export const useMapGridLayer = (lat: number, lng: number, scale = 1) => {
	const data = useMemo(() => {
		const minPoint = turf.destination(
			turf.destination([lng, lat], (TILE_LENGTH_KM * TILE_COUNT) / 2, 180, {
				units: 'kilometers',
			}).geometry,
			(TILE_LENGTH_KM * TILE_COUNT) / 2,
			270,
			{ units: 'kilometers' },
		);
		const maxPoint = turf.destination(
			turf.destination(minPoint.geometry, TILE_LENGTH_KM * TILE_COUNT, 0, {
				units: 'kilometers',
			}).geometry,
			TILE_LENGTH_KM * TILE_COUNT,
			90,
			{ units: 'kilometers' },
		);

		const poly = turf.bboxPolygon([
			minPoint.geometry.coordinates[0],
			minPoint.geometry.coordinates[1],
			maxPoint.geometry.coordinates[0],
			maxPoint.geometry.coordinates[1],
		]);

		return turf.featureCollection([poly]);
	}, [lat, lng, scale]);

	const layer = useMemo(
		() =>
			new GeoJsonLayer({
				id: 'map-grid-layer',
				data,
				pickable: false,
				stroked: true,
				filled: true,
				lineWidthScale: 1,
				lineWidthMinPixels: 2,
				getFillColor: [63, 63, 63, 63],
				getLineColor: [0, 255, 0, 255],
				getLineWidth: 1,
			}),
		[data],
	);

	return layer;
};
