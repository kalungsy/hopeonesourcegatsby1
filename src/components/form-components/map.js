import React, { useState, useEffect } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import {Icon} from 'antd';

const getWebLocation = () => {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			/* geolocation is available */
			navigator.geolocation.getCurrentPosition(
				(position) => {
					console.log('getting locationo', position);
					resolve({ lat: position.coords.latitude, long: position.coords.longitude });
				},
				() => {
					resolve({
						lat: 37.7577,
						long: -122.4376
					});
					console.error('error getting location');
				}
			);
		} else {
			/* geolocation IS NOT available */
			console.log('gelocation not available');
			const reason = new Error('Geolocation is not available');
			reject(reason);
		}
	});
};

const Map = (props) => {
    const { setCoordinates } = props;
    
    let mapHeight = '450px';

	let [ viewport, setViewport ] = useState({
		width: '100%',
		height: mapHeight,
		latitude: 37.7577,
		longitude: -122.4376,
		zoom: 8
	});
	let [ loading, setLoading ] = useState(true);

	useEffect(() => {
		if (loading) {
			async function fetchLocation() {
				return await getWebLocation();
			}

			fetchLocation().then((result) => {
				console.log('location', result);
				if (result) {
					setViewport({
						...viewport,
						latitude: result.lat,
						longitude: result.long,
						zoom: 15
					});
				}
			});
			setLoading(false);
		}

		return () => {};
	});

	return (
		<ReactMapGL
			{...viewport}
			mapboxApiAccessToken="pk.eyJ1Ijoia2FsdW5nc3kiLCJhIjoiY2p6ajJhaXBrMDVpaDNjcGVmNGhya3kwaSJ9.05anissI745dE-7itWE92g"
			onViewportChange={(viewport) => {
				setViewport(viewport);
				if (setCoordinates) {
					setCoordinates(viewport.latitude, viewport.longitude);
				}
			}}
		>
			<Marker draggable latitude={viewport.latitude} longitude={viewport.longitude} offsetLeft={-20} offsetTop={-10} 
				// onDragEnd={(e)=>{
				// 	e.preventDefault();
				// 	console.log('drag ended', e)
				// 	setViewport({
				// 		...viewport,
				// 		latitude: e.lngLat[0],
				// 		longitude: e.lngLat[1]
				// 	})
				// }}
				>
                <Icon type="environment" style={{fontSize: '2.5em', color: 'red'}} theme="filled"/>
			</Marker>
			{/* <span>{`Lat: ${viewport.latitude}, Long: ${viewport.longitude}`}</span> */}
		</ReactMapGL>
	);
};

export default Map;
