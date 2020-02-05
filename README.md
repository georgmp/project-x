### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive

# Crimemapper

## Overview
Crimemapper is a map-based application that lets you explore crime. Users can use a polygon draw tool to define the boundaries of an area which then gets populated with markers at crime locations. Clicking the markers will reveal the type of crime.

This is an extra-curricular project of the Software Engineering Immersive Course at General Assembly, London. The task was to create a **React app** using data from an **API** of our choice and was to be completed **individually** over **one weekend**.

You can launch the application on GitHub pages [here](https://georgpreuss.github.io/project-x/), or find the GitHub repo [here](https://github.com/georgpreuss/project-x/).

## Brief
- Create a react app that talks to an API and displays some data
- Use any API you like
- Use some new libraries in your creation
- Host it on GitHub pages

## Technologies used
- HTML
- SCSS
- JavaScript (ES6)
- React.js
- Mapbox
- Police API

## Approach
- The police API can take a polygon of coordinates
- Initially, I thought of using borough borders but these unfortunately exceed the string limit of the API so instead I decided to add a polygon draw tool

### Polygon draw tool
- This is a Mapbox feature I imported called `MapboxDraw`
- On draw, the coordinates are fed into the API call request as follows (`placePins` is the function I wrote to add the different markers onto the map):

```
function drawArea() {
      const coordinatesOfPolygon = Draw.getAll().features[0].geometry.coordinates[0]      
      const coordinatesForApi = coordinatesOfPolygon.map((elem) => {
        return [elem[1], elem[0]]
      }).join(':')
      const baseURL = 'https://data.police.uk/api/crimes-street/all-crime?poly='
      fetch(`${baseURL + coordinatesForApi}`)
        .then(resp => resp.json())
        .then(resp => placePins(resp))
    }
``` 

## Screenshots
Coming soon

## Bugs
- The clear function only clears the polygon and not the markers it contained - this is more a lack of necessary code than a bug

## Potential future features
- In a previous version I displayed more information in the popup like the date of the crime - I would like to revert to this version and add some styling
- I would ideally have liked the 'bounding box' for each API call to be the actual viewport but this could easily exceed any API call limitations
- The ability to filter crime, e.g. by type or date

## Lessons learned
- Mapbox was probably quite ambitious at this stage in the course and the many different versions of Mapbox and the lack of good documentation made using it all the more challenging
- While I did write most of this application in React I realise that most of the Mapbox functionality I used is written in plain JavaScript so I will try to redo this in React the next time I use Mapbox