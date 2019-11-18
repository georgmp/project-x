import React from 'react'
import ReactDOM from 'react-dom'
// import ReactMapGL from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './style.scss'
import Info from './components/InfoOverlay'
const MapboxDraw = require('@mapbox/mapbox-gl-draw')
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvcmdwIiwiYSI6ImNrMzM1bnN0azBuY2IzZnBiZ3d2eDA5dGQifQ.Ym1lHqYUfUUu2m897J4hcg'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lng: -0.09,
      lat: 51.505,
      zoom: 11
    }
  }

  componentDidMount() {

    // const array = []
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    })
    const Draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    })

    map.addControl(Draw, 'top-left')

    map.on('draw.create', drawArea)
    map.on('draw.delete', clearArea)
    // below function lets you move polygon
    // map.on('draw.update', updateArea)

    function drawArea() {
      const coordinatesOfPolygon = Draw.getAll().features[0].geometry.coordinates[0]
      // console.log(coordinatesOfPolygon)
      // does it matter that it duplicates first and last coordinate??
      const coordinatesForApi = coordinatesOfPolygon.map((elem) => {
        return [elem[1], elem[0]]
      }).join(':')
      const baseURL = 'https://data.police.uk/api/crimes-street/all-crime?poly='
      fetch(`${baseURL + coordinatesForApi}`)
        .then(resp => resp.json())
        .then(resp => placePins(resp))
    }

    function clearArea() {
      Draw
        .deleteAll()
        .getAll()
    }

    // [
    //   {
    //     "category": "anti-social-behaviour",
    //     "location_type": "Force",
    //     "location": {
    //       "latitude": "52.342301",
    //       "street": {
    //         "id": 564429,
    //         "name": "On or near Festival Road"
    //       },
    //       "longitude": "0.416614"
    //     },
    //     "context": "",
    //     "outcome_status": null,
    //     "persistent_id": "",
    //     "id": 77271338,
    //     "location_subtype": "",
    //     "month": "2019-09"
    //   },

    function placePins(response) {
      const formattedResponse = response.map((elem) => {
        return {
          properties: {
            description: elem.category
          },
          geometry: {
            type: 'Point',
            coordinates: [elem.location.longitude, elem.location.latitude]
          }
        }
      })
      map.loadImage('https://i.imgur.com/MK4NUzI.png', function (error, image) {
        if (error) throw error
        map.addImage('custom-marker', image)
        /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
        map.addLayer({
          id: 'markers',
          type: 'symbol',
          /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: formattedResponse
            }
          },
          layout: {
            'icon-image': 'custom-marker'
          }
        })
      })

      map.on('click', 'markers', function (e) {
        const coordinates = e.features[0].geometry.coordinates.slice()
        const description = e.features[0].properties.description

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map)
      })

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'markers', function () {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'markers', function () {
        map.getCanvas().style.cursor = ''
      })

      console.log(formattedResponse)
    }
  }

  render() {
    return (
      <div>
        <div ref={el => this.mapContainer = el} className='mapContainer' />
        <Info />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)