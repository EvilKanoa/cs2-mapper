import React from 'react';
import ReactDOM from 'react-dom/client';
import { MapView } from './views/map.tsx';

ReactDOM.createRoot(document.getElementById('app')!).render(
	<React.StrictMode>
		<MapView />
	</React.StrictMode>,
);
