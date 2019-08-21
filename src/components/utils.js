const getWebLocation = async () => {
	let locationPermission;

	return navigator.permissions
		.query({
			name: 'geolocation'
		})
		.then(function(result) {
			locationPermission = result.state;
			console.log('location permission', locationPermission);

			return new Promise((resolve, reject) => {
				if (navigator.geolocation && locationPermission !== 'denied') {
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
					let reason;
					if (locationPermission === 'denied') {
						console.log('gelocation permission was denied');
						reason = new Error('Geolocation permission was denied');
					}else{
						console.log('gelocation not available');
						reason = new Error('Geolocation is not available');
					}
					reject(reason);
				}
			});
		});
};

const getGeoFeature = async (long, lat) => {
	let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?type=address&access_token=pk.eyJ1Ijoia2FsdW5nc3kiLCJhIjoiY2p6ajJhaXBrMDVpaDNjcGVmNGhya3kwaSJ9.05anissI745dE-7itWE92g`;
	let geoData;
	await fetch(url).then((response) => response.json()).then((data) => {
		console.log('My location', data);
		geoData = data;
	});
	return geoData;
};

export { getWebLocation, getGeoFeature };
