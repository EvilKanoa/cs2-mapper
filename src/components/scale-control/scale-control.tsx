import './scale-control.css';

export const ScaleControl = () => {
	return (
		<div>
			Scale
			<input className="scale-input" type="number" step="0.1" />
		</div>
	);
};
