import DeckGL from '@deck.gl/react/typed';
import { useOSMTileLayer } from '../layers/OSMTileLayer';
import { memo, useCallback, useState } from 'react';
import { useMapGridLayer } from '../layers/MapGridLayer';
import { Topbar } from '../components/topbar/topbar';

// Viewport settings
const INITIAL_VIEW_STATE = {
	longitude: -122.41669,
	latitude: 37.7853,
	zoom: 11,
	pitch: 0,
	bearing: 0,
};

export const MapView = memo(() => {
	const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
	const osmTileLayer = useOSMTileLayer();
	const mapGridLayer = useMapGridLayer(viewState.latitude, viewState.longitude);

	return (
		<>
			<Topbar />
			<DeckGL
				viewState={viewState}
				onViewStateChange={useCallback(
					(e: any) => setViewState(e.viewState),
					[setViewState],
				)}
				controller={true}
				layers={[osmTileLayer, mapGridLayer]}
			/>
		</>
	);
});
