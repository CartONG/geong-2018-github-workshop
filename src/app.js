
(function () {

  var fitBoundsOptions = {
    padding: [10, 10],
    maxZoom: 15,
    animate: true,
    duration: 0.4
  };

  function getBasemaps () {
    var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    });

    var light = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    var sat = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    return {
      'OSM': OSM,
      'HOT': HOT,
      'Light': light,
      'Satellite': sat
    };
  }

  function setContent () {
    document.querySelector('h1.header').innerHTML = CartONG.config.content.header;
    document.querySelector('h2.sub-header').innerHTML = CartONG.config.content.subHeader;
    document.querySelector('p.description').innerHTML = CartONG.config.content.description;
    document.querySelector('p.source').innerHTML = 'Source: ' + CartONG.config.content.source;
  }

  function propToRow (feature, prop) {
    return '<tr><td>' + prop + '</td><td>' + feature.properties[prop] + '</td></tr>';
  }

  function featureToTable (feature) {
    var tableRows = Object
      .keys(feature.properties)
      .map(propToRow.bind(null, feature));
    return '<table><tbody>' + tableRows.join('') + '</tbody></table>';
  }

  function getOverlayOptions () {
    return {
      style: function () {
        return CartONG.config.webmap.style;
      },
      pointToLayer: function (geoJsonPoint, latlng) {
        var marker = L.marker(latlng)
        marker.setOpacity(CartONG.config.webmap.style.opacity)
        return marker;
      },
      onEachFeature: function (feature, layer) {
        var table = featureToTable(feature);
        layer.bindPopup(table, { maxHeight: 200, className: 'attrs-popup' });
      }
    };
  }

  function main () {
    var map = L.map('webmap').setView([45.57, 5.9118], 4);    
    var basemaps = getBasemaps();
    var overlay = L.geoJSON(null, getOverlayOptions());
    var control = L.control.layers(basemaps, { 'Overlay': overlay });

    setContent();

    basemaps.OSM.addTo(map);
    overlay.addTo(map);
    control.addTo(map);
  
    axios.get(CartONG.config.webmap.dataURL)
      .then(function (response) {
        overlay.addData(response.data);
        map.fitBounds(overlay.getBounds(), fitBoundsOptions);
      });
  }  

  main ();

})();
