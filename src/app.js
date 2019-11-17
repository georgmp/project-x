import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import ReactMapGL from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

import './style.scss'

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvcmdwIiwiYSI6ImNrMzM1bnN0azBuY2IzZnBiZ3d2eDA5dGQifQ.Ym1lHqYUfUUu2m897J4hcg'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lng: -0.09,
      lat: 51.505,
      zoom: 9
    }
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    })
  }
  render() {
    return (
      <div>
        <div ref={el => this.mapContainer = el} className='mapContainer'/>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)