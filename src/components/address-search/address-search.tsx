import { useCallback, useState } from 'react';
import {
	GeocodeQueryState,
	GeocodeResult,
	useGeocode,
} from '../../api/geocode';
import './address-search.css';

const Results = ({
	status,
	results,
	onClick,
}: {
	status: GeocodeQueryState;
	results: GeocodeResult[];
	onClick: (result: GeocodeResult) => void;
}) => {
	return (
		<div className="address-search-results">
			{status === GeocodeQueryState.ERROR && <p>Failed to load...</p>}
			{status === GeocodeQueryState.LOADING && <p>Loading...</p>}
			{status === GeocodeQueryState.SUCCESS &&
				results.map((result, idx) => (
					<button
						className="result-button"
						key={result.name + idx}
						onClick={() => onClick(result)}
					>
						{result.name}
					</button>
				))}
		</div>
	);
};

export const AddressSearch = ({
	setViewState,
}: {
	setViewState: (viewState: any) => void;
}) => {
	const [query, setQuery] = useState('');
	const [results, status] = useGeocode(query);
	const [focused, setFocused] = useState(false);

	const onClick = useCallback(
		(result: GeocodeResult) => {
			console.log({ latitude: result.lat, longitude: result.lng, zoom: 11 });
			setViewState({ latitude: result.lat, longitude: result.lng, zoom: 11 });
		},
		[setViewState],
	);

	return (
		<div>
			<input
				type="text"
				placeholder="Search for a location..."
				value={query}
				onChange={useCallback(
					(e: any) => {
						setQuery(e.target.value);
					},
					[setQuery],
				)}
				onFocus={useCallback(() => setFocused(true), [setFocused])}
				onBlur={useCallback(
					// set timeout hack since clicking on a result triggers a blur directly
					() => setTimeout(() => setFocused(false), 250),
					[setFocused],
				)}
			/>
			{focused && (
				<Results status={status} results={results} onClick={onClick} />
			)}
		</div>
	);
};
