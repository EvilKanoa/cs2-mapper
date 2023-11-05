import { AddressSearch } from '../address-search/address-search';
import { ScaleControl } from '../scale-control/scale-control';
import './topbar.css';

export const Topbar = () => {
	return (
		<div className="topbar">
			<AddressSearch />
			<span>
				<h1>CS2 Mapper</h1>
			</span>
			<ScaleControl />
		</div>
	);
};
