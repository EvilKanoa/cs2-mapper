import { AddressSearch } from '../address-search/address-search';
import { ExportButton } from '../export-button/export-button';
import type { Polygon, Feature } from '@turf/turf';
import './topbar.css';

export const Topbar = ({
	setViewState,
	boundingPoly,
}: {
	setViewState: (viewState: any) => void;
	boundingPoly: Feature<Polygon>;
}) => {
	return (
		<div className="topbar">
			<AddressSearch setViewState={setViewState} />
			<span>
				<h1>CS2 Mapper</h1>
			</span>
			<ExportButton boundingPoly={boundingPoly} />
		</div>
	);
};
