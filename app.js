const options = {
	method: "GET",
	url: "https://billboard-api2.p.rapidapi.com/hot-100",
	params: { date: "2019-05-11", range: "1-10" },
	headers: {
		"x-rapidapi-key": "d507abadacmsh62ff5533fd6d0f5p10475bjsn69568d627955",
		"x-rapidapi-host": "billboard-api2.p.rapidapi.com",
	},
};

axios
	.request(options)
	.then(function (response) {
		console.log(response.data);
	})
	.catch(function (error) {
		console.error(error);
	});
