# The Zine Dreams Catalog API
This is a RESTful API built with [NodeJS](https://nodejs.org/en/) and [Express](http://expressjs.com/). The JSON comes from a Mongo database, using [Mongoose](https://github.com/Automattic/mongoose) as its object modeling tool.

The Mongo database is seeded with zine metadata from the [Flywheel Zine Library](www.flywheelarts.org) and the [Queer Zine Archive Project](wwww.qzap.org). To learn more about their collections and efforts to catalog zines, please visit their respective websites.

## API Definition
Every endpoint serves `json` data.

#### Authentication
- This is an open API serving [The Zine Dream Catalog Project](http://zinedreams.com) by Dianne Laguerta. It was made in part of their capstone project during their time at the [Ada Developers Academy](http://adadevelopersacademy.org/).

#### Interface
- This part of the project is purely an API; all interactions should happen over HTTP requests. To see the API used in a front-end interface, check out [The Zine Dream Catalog Project](http://zinedreams.com). If you're interested in seeing the code for the website, visit the [Ember repo](https://github.com/dlaguerta/ember-zine-catalog) for the project that's built on top of this API.

