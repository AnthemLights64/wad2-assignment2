# Assignment 2 - Web API.

Name: Wenlong Lu

## Features.
 
 + Feature 1 - Many new API routes, including a parameterised URL. See API design.
 + Feature 2 - Mongo integration.
 + Feature 3 - Minimal React integration(GET and POST data to API).
 + Feature 4 - Coherent API design and modelling supporting full manipulation of resources. For example, add(post), delete(delete), update(put), search(get)
 + Feature 5 - Nested Document and/or object referencing in Mongo/Mongoose. See Object models in "api" folder.
 + Feature 6 - Basic Authentication and protected routes. (When accessing the favourites and watchlist in ReactApp, it will ask for signing in. See video.)
 + Feature 7 - Use of express middleware (e.g. Error handling, session middle).
 + Feature 8 - Substantial React App integration. See video.
 + Feature 9 - API documentation: Swagger
## Installation Requirements

Dependencies should all be in package.json
(Include a proxy in package.json)
The repo of React App: https://github.com/AnthemLights64/wad2-moviesApp

```bat
git clone https://github.com/AnthemLights64/wad2-assignment2
```

followed by installation

```bat
npm install
```

## API Configuration

Create an ``.env`` and put following variables in it.

```bat
NODE_ENV=development
PORT=8080
HOST=
mongoDB=YourMongoURL
seedDb=true
secret=YourJWTSecret
```

## API Design
Give an overview of your web API design, perhaps similar to the following: 

|  |  GET | POST | PUT | DELETE
| -- | -- | -- | -- | -- 
| /api/movies |Gets a list of movies | Add a new movie to database | N/A | N/A
| /api/movies/{movieid} | Get a Movie | N/A | Update a movie | Delete a movie
| /api/movies/{movieid}/reviews | Get all reviews for movie | Create a new review for Movie | N/A | N/A  
| /api/movies/{movieid}/similar | Get a list of similar movies of this movie | N/A | N/A | N/A
| /api/movies/{movieid}/credits | Get a list of credits of this movie | N/A | N/A | N/A
| /api/upcomings |Gets a list of movies | Add a new movie to database | N/A | N/A
| /api/upcomings/{movieid} | Get a Movie | N/A | Update a movie | Delete a movie 
| /api/upcomings/{movieid}/similar | Get a list of similar movies of this movie | N/A | N/A | N/A
| /api/upcomings/{movieid}/credits | Get a list of credits of this movie | N/A | N/A | N/A
| /api/topRated |Gets a list of movies | Add a new movie to database | N/A | N/A
| /api/topRated/{movieid} | Get a Movie | N/A | Update a movie | Delete a movie
| /api/topRated/{movieid}/reviews | Get all reviews for movie | Create a new review for Movie | N/A | N/A  
| /api/topRated/{movieid}/similar | Get a list of similar movies of this movie | N/A | N/A | N/A
| /api/topRated/{movieid}/credits | Get a list of credits of this movie | N/A | N/A | N/A
| /api/users |Gets a list of users | Add a new user to database | N/A | N/A
| /api/users/{userName} | N/A | N/A | Update a user | N/A
| /api/users/{userName}/favourites | Get favourite movie(s) of this user | Add a movie into the favourites of this user | N/A | N/A
| /api/users/{userName}/favourites/{movieid} | N/A | N/A | N/A| Delete a movie from favourites of this user
| /api/users/{userName}/watchlist | Get watchlist of this user | Add a movie into the watchlist of this user | N/A | N/A
| /api/users/{userName}/watchlist/{movieid} | N/A | N/A | N/A| Delete a movie from watchlist of this user
| /api/genres | Get genres | N/A | N/A | N/A
| /api/actors | Get a list of actors | Add a new actor to datase | N/A | N/A
| /api/actors | Get an actor by id | N/A | Update an actor by id | Delete an actor by id

[Swaggerhub](https://app.swaggerhub.com/apis/AnthemLights/WebAssignment/1.0.0).


## Security and Authentication

Authentication / security implemented on the API: passport/sessions. 
The routes of movies and upcoming movies are protected.
In the React App, the protected routes are the Favorites page and the Watchlist page.

## Integrating with React App

The React App invokes API from the assignment 2. Includes movies, movie details, movie reviews, movie credits, credit details, similar movies, top rated movies, upcoming movies, actors, actor details

The React App repo is shown below.
[Github](https://github.com/AnthemLights64/wad2-moviesApp).

The API calls are similar, I will put an example of parameterized and an example of non-parameterized.
Example:
~~~Javascript
export const getMovies = () => {
  return fetch(
     '/api/movies',{headers: {
       'Authorization': window.localStorage.getItem('token')
    }
  }
  )
    .then(res => res.json())
    .then(json => {return json.results;});
};

export const getMovie = id => {
    return fetch(
      `/api/movies/${id}`,{headers:{
        'Authorization': window.localStorage.getItem('token') 
      },
    method:'get',
      }
      ).then(res => res.json()); 
  };

~~~

## Extra features

Included in features on the top.

## Independent learning.

API documentation: Swagger
