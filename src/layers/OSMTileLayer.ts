import { BitmapLayer } from '@deck.gl/layers/typed';
import { TileLayer } from '@deck.gl/geo-layers/typed';
import { useMemo } from 'react';

export class OSMTileLayer extends TileLayer {
	static componentName = 'OSMTileLayer';

	constructor() {
		super({
			// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
			data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',

			minZoom: 0,
			maxZoom: 19,
			tileSize: 256,

			renderSubLayers: OSMTileLayer._renderSubLayers,
		});
	}

	static _renderSubLayers = (props: any) => {
		const {
			bbox: { west, south, east, north },
		} = props.tile;

		return new BitmapLayer(props, {
			// @ts-ignore
			data: null,
			image: props.data,
			bounds: [west, south, east, north],
		});
	};
}

export const useOSMTileLayer = () => {
	const osmTileLayer = useMemo(() => new OSMTileLayer(), []);
	return osmTileLayer;
};
