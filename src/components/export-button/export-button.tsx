import type { Polygon, Feature } from '@turf/turf';
import { useCallback, useState } from 'react';
import { generateHeightmap } from '../../lib/heightmap';
import './export-button.css';

const download = (
	data: ArrayBuffer | Blob | string,
	filename: string,
	type: string,
) => {
	const file = new Blob([data], { type: type });
	const anchor = document.createElement('a');
	const url = URL.createObjectURL(file);
	anchor.href = url;
	anchor.download = filename;

	document.body.appendChild(anchor);
	anchor.click();

	setTimeout(() => {
		document.body.removeChild(anchor);
		window.URL.revokeObjectURL(url);
	}, 0);
};

export const ExportButton = ({
	boundingPoly,
}: {
	boundingPoly: Feature<Polygon>;
}) => {
	const [exporting, setExporting] = useState(false);
	const onClick = useCallback(() => {
		setExporting(true);
		generateHeightmap(boundingPoly)
			.then((data) => {
				// TODO: update filename/type, and content type.
				download(data, 'heightmap.filetype', 'application/text');
			})
			.catch((err) => {
				alert('Failed to generate height map!');
				console.error(err);
			})
			.finally(() => {
				setExporting(false);
			});
	}, [setExporting, boundingPoly]);

	return (
		<>
			<button onClick={onClick}>Export heightmap...</button>
			{exporting && (
				<div className="export-overlay">
					<h1>Exporting...</h1>
				</div>
			)}
		</>
	);
};
