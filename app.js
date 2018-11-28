// initialize map
let map = L.map('map').setView([25.27, -38.83], 2.5);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiY2hhcmxvdHRldHVzc2V0IiwiYSI6ImNqb3UwdmQwNzE3NTEza3BibmYxZmp2cTkifQ.rgJJuKkJRmrKn3vbwpIgcA'
}).addTo(map);

// change icon
var blueYacht = L.icon({
    iconUrl: 'assets/cruise.svg',
    iconSize:     [48, 105], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// get input to filter
var result = "";
document.getElementById("input").onchange = function(e) {
	result = e.target.value;
	getJson();
}

// Axios
function getJson() {

	var list = document.getElementById("display");
	list.innerHTML = '';

	// get json with axios
	axios.get('data/sample_yachts.json')
	  .then(response => {
		// filter data
		var unfilteredData = response.data.data;
		var myData = unfilteredData.filter(searchData => {
			var search = searchData.name + " " + searchData.year + " " + searchData.length;
			return search.toLowerCase().match(result);
		});

		for (var i = 0; i < myData.length; i++) {

			var item =	document.createElement('DIV');
			var img = document.createElement('IMG');
			var name = document.createElement('H4');
			var summary = document.createElement('P');
			var year = document.createElement('P');
			var length = document.createElement('P');
			var link = document.createElement('A');

			img.setAttribute('class', 'image');
			img.setAttribute('src', myData[i].masthead);
			name.setAttribute('class', 'name');
			name.innerHTML = myData[i].name;
			summary.setAttribute('class', 'summary');
			summary.innerHTML = myData[i].summary;
			year.setAttribute('class', 'year');
			year.innerHTML = myData[i].year;
			length.setAttribute('class', 'length');
			length.innerHTML = myData[i].length;
			var slug = myData[i].slug;
			var url = "https://www.feadship.nl/en/fleet/yacht/%60";
			var newUrl = url.replace("%60", slug);
			link.setAttribute('href', newUrl);
			link.innerHTML = "More info";

			item.appendChild(img);
			item.appendChild(name);
			item.appendChild(summary);
			item.appendChild(year);
			item.appendChild(length);
			item.appendChild(link);
			item.setAttribute('class', 'item');
			list.appendChild(item);

			// markers
			var lat = myData[i].lat;
			var lng = myData[i].lng;
			var marker = L.marker([lat, lng], {icon: blueYacht}).addTo(map);
			marker.bindPopup(
				"<h2>" + myData[i].name + "</h2>"
				 + myData[i].year + "<br>" + myData[i].length
			);
			marker.on('click', function(e){
			    map.setView(e.latlng, 13);
			});

			// to link yachts and map
			var value = "linkYachts("+lat + ", " + lng+")";
			document.getElementsByClassName("item")[i].setAttribute('onclick', value);
		}
	})
	.catch(() => {
		console.log('An error occured;')
	})  
}
getJson();

// to link markers and yachts
function linkYachts(input1, input2) {
	map.setView([input1, input2], 10);
} 
