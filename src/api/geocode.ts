import { useEffect, useRef, useState } from 'react';
import { toJsonIfStatus } from './util';

export interface GeocodeResult {
	name: string;
	lat: number;
	lng: number;
	importance: number;
}

interface GeocodeRequest {
	q: string;
	onFinish: (result: Promise<GeocodeResult[]>) => void;
}

class Geocode {
	private forwardRequests: GeocodeRequest[] = [];
	private forwardCache: Record<string, GeocodeResult[]> = {};

	constructor() {
		setInterval(() => {
			const nextRequest = this.forwardRequests.shift();

			if (nextRequest == null) {
				return;
			}

			this.doForward(nextRequest.q).then(
				(value) => nextRequest.onFinish(Promise.resolve(value)),
				(err) => nextRequest.onFinish(Promise.reject(err)),
			);
		}, 700);
	}

	public forward = async (query: string): Promise<GeocodeResult[]> => {
		const q = encodeURIComponent(query);

		if (q in this.forwardCache) {
			return this.forwardCache[q];
		}

		return new Promise((resolve, reject) => {
			this.forwardRequests.push({
				q,
				onFinish: (result) =>
					result.then(
						(value) => resolve(value),
						(err) => reject(err),
					),
			});
		});
	};

	private doForward = async (query: string): Promise<GeocodeResult[]> => {
		const q = encodeURIComponent(query);
		const response = await fetch(`https://geocode.maps.co/search?q=${q}`, {
			headers: { Accept: 'application/json' },
		}).then(toJsonIfStatus(200));

		const results: GeocodeResult[] = (response as any[]).map((result) => ({
			name: result.display_name,
			lat: parseFloat(result.lat),
			lng: parseFloat(result.lon),
			importance: result.importance,
		}));
		this.forwardCache[q] = results;

		return results;
	};
}

export const geocode = new Geocode();

export enum GeocodeQueryState {
	SUCCESS,
	ERROR,
	LOADING,
}

export const useGeocode = (
	query: string,
): [GeocodeResult[], GeocodeQueryState] => {
	const [results, setResults] = useState<GeocodeResult[]>([]);
	const [state, setState] = useState<GeocodeQueryState>(
		GeocodeQueryState.LOADING,
	);
	const requestTimeout = useRef<number | null>(null);

	useEffect(() => {
		if (requestTimeout.current != null) {
			clearTimeout(requestTimeout.current);
		}

		setState(GeocodeQueryState.LOADING);
		const myTimeout = (requestTimeout.current = setTimeout(
			() =>
				geocode.forward(query).then(
					(value) => {
						if (requestTimeout.current === myTimeout) {
							requestTimeout.current = null;
							setResults(value);
							setState(GeocodeQueryState.SUCCESS);
						}
					},
					(err) => {
						console.warn('Geocode error', err);
						if (requestTimeout.current === myTimeout) {
							requestTimeout.current = null;
							setState(GeocodeQueryState.ERROR);
						}
					},
				),
			700,
		));
	}, [query]);

	return [results, state];
};
