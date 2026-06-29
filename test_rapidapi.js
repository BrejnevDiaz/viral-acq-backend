const url = 'https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile_hover.php?username_or_url=iambrejnevdiaz';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com',
		'x-rapidapi-key': 'f540ffb003msh5fc0253123bc6cfp170e26jsn788be8089a42'
	}
};

fetch(url, options)
	.then(res => res.json())
	.then(json => console.log(JSON.stringify(json, null, 2)))
	.catch(err => console.error(err));
