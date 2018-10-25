
(function () {

  // Set Header, Subheader and description (based on the content of the config.js file)
  document.querySelector('h1.header').innerHTML = CartONG.config.header;
  document.querySelector('h2.sub-header').innerHTML = CartONG.config.subHeader;
  document.querySelector('p.description').innerHTML = CartONG.config.description;  

  var map = L.map('webmap').setView([45.57, 5.9118], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var geojsonLayer = L.geoJSON(null, {
    onEachFeature: function (feature, layer) {
      var tableContent = Object.keys(feature.properties)
        .map(function (prop) {
          return  '<tr><td>' + prop + '</td><td>' + feature.properties[prop] + '</td></tr>';
        });
      var table = '<table><tbody>' + tableContent.join('') + '</tbody></table>';
      layer.bindPopup(table, { maxHeight: 200, className: 'attrs-popup' });
    }
  }).addTo(map);

  axios.get(CartONG.config.url)
    .then(function (response) {
      geojsonLayer.addData(response.data);
      map.fitBounds(geojsonLayer.getBounds(), {
        padding: [10, 10],
        maxZoom: 15,
        animate: true,
        duration: 0.4
      });
    });

})();