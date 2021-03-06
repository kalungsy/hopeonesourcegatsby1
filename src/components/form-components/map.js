import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Icon, Card } from 'antd';
import { getWebLocation, getGeoFeature } from '../utils';

const Map = (props) => {
	const {
		myCoordinates,
		setCoordinates,
		usingMyLocation,
		setUsingMyLocation,
		parentGeoFeatureData,
		setParentGeoFeatureData
	} = props;

	let mapHeight = '450px';

	let [ viewport, setViewport ] = useState({
		width: '100%',
		height: mapHeight,
		latitude: myCoordinates.lat || 37.7577,
		longitude: myCoordinates.long || -122.4376,
		zoom: 13,
	});
	let [ loading, setLoading ] = useState(true);
	let [ geoFeatureData, setGeoFeatureData ] = useState(null);
	let [ isDragging, setIsDragging ] = useState(false);

	useEffect(() => {
		console.log("ran map effect", viewport)
		if (loading) {
			async function fetchLocation() {
				return await getWebLocation().catch((e) => {
					console.log('Could not fetchLocation', e.message);
				});
			}

			fetchLocation()
				.then((result) => {
					console.log('location', result);
					if (result) {
						setViewport({
							...viewport,
							latitude: result.lat,
							longitude: result.long,
							zoom: 15
						});
					}
				})
				.catch((e) => {
					console.log(e);
				});
			setLoading(false);
		}

		if (usingMyLocation && myCoordinates.lat != viewport.latitude && myCoordinates.long != viewport.longitude) {
			setViewport({
				...viewport,
				latitude: myCoordinates.lat,
				longitude: myCoordinates.long
			});
		}

		if (parentGeoFeatureData && parentGeoFeatureData.features.length) {
			if (!geoFeatureData) {
				setGeoFeatureData(parentGeoFeatureData);
			} else {
				if (
					geoFeatureData.features.length &&
					geoFeatureData.features[0].place_name != parentGeoFeatureData.features[0].place_name
				) {
					setGeoFeatureData(parentGeoFeatureData);
				}
			}
		}

		if (isDragging == 'done') {
			(async () => {
				let fetchedGeoFeatures = await getGeoFeature(viewport.longitude, viewport.latitude);
				setGeoFeatureData(fetchedGeoFeatures);
				setParentGeoFeatureData(fetchedGeoFeatures);
				console.log('GeoFeatureData', fetchedGeoFeatures);
				setIsDragging(false);
			})();
		}

		return () => {};
	});

	return (
		<div className="form-map">
			<ReactMapGL
				{...viewport}
				mapboxApiAccessToken="pk.eyJ1Ijoia2FsdW5nc3kiLCJhIjoiY2p6ajJhaXBrMDVpaDNjcGVmNGhya3kwaSJ9.05anissI745dE-7itWE92g"
				onViewportChange={async (viewport) => {
					setViewport(viewport);
					setUsingMyLocation(false);
					setCoordinates({
						lat: viewport.latitude,
						long: viewport.longitude
					});
				}}
				onTransitionEnd={(e) => {
					console.log('transition ended', e);
				}}
				onInteractionStateChange={({isDragging, isPanning, isRotating, isZooming}) => {
					if (isDragging || isPanning || isRotating || isZooming) {
						console.log('Moving');
						setIsDragging(true);
					} else {
						setIsDragging('done');
					}
				}}
			>
				<Marker
					draggable
					latitude={viewport.latitude}
					longitude={viewport.longitude}
					offsetLeft={-20}
					offsetTop={-10}
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
					<Icon type="environment" style={{ fontSize: '2.5em', color: 'red' }} theme="filled" />
				</Marker>

				{geoFeatureData &&
				geoFeatureData.features.length && (
					<Card className={`__map-address-card`} style={{ width: '45%', top: '10px', left: '10px' }}>
						<h4>{geoFeatureData.features[0].place_name}</h4>
					</Card>
				)}
				{/* <span>{`Lat: ${viewport.latitude}, Long: ${viewport.longitude}`}</span> */}
			</ReactMapGL>
		</div>
	);
};

export default Map;
