COGS 121 Group K Assignment 2

TASKS

- Brian: worked on incorporating Leaflet to portray data based on geolocation and style map; added transitions and legend to pie chart, sorted crime type data; added slider for hours

- Tim: worked on the query and using Google API to get latitude/longitude data for Leaflet; set up routes and data for D3,; did lots of debugging and helping

- Ellen: worked on the stacked bar chart to show overall crime percentage based on time; helped to sort crime type data; overall design/CSS

- Shuyu: worked on getting the pie chart to show percentage of crime in the view at a given a time

- Jiaying: worked on cleaning the data for Yelp and the get started page

- Everyone worked on responsiveness

SIX DESIGN PRINCIPLES

The purpose of our application is for law enforcement officers to efficiently patrol reas that are unsafe.

1. Discoverability/Signifiers - With our app, law enforcement officers can easily view exact locations where crimes were committed (and how many) based on time of day to help them more efficiently patrol unsafe areas. The time of day can easily be adjusted with the slider, which is clearly labeled.

2. Learnability - Our app contains a typical map that moves around/zooms like other common maps (e.g., Google Maps). There is an easily visible slider that adjusts the map and the pie chart together according to time.
	
3. Feedback - If users zoom in on the map or adjust the slider, the icons in the map and the pie chart will both update based on the current map view to better represent location, type, and density of crimes.

4. Natural Mapping/Mental Metaphors - We have icons on the map to represent the types of crime, such as a crying baby to represent child abuse, as a metahpor to help users more recognize the type of crime. Each section/page also has an indicator to prompt the user to go to the next section.

5. Constraints - The map is locked to only show San Diego versus scrolling through the world. Our application also only shows one screen at a time, but has indicators to scroll/proceed to the screen below it.

6. Error Prevention/Recovery - Since scrolling is the primary way to zoom in the map, as well as navigate down the page, there is potential
for the user to accidentally zoom in on the map when he/she wanted to actually scroll down the page. We have prevented this by requiring
the user to click on the map before being able to zoom in/out with the scroll wheel.

CSS DESIGN DECISION

Our team decided to use custom CSS because we didn't want to be constrained with Bootstrap and just wanted to more fully develop our CSS skills and to more precisely express ourselves and our designs. We decided to use custom JS because we have a lot of objects that we needed to manipulate in the DOM as well as to use AJAX to get data from our server, necessitating the need for full control of our Javascript.


### Codeship
![Codeship Status for watchtower](https://codeship.com/projects/076a16c0-eb5a-0133-7ce2-5680c82dbe9d/status?branch=master)