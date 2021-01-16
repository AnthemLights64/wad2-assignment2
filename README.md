# Assignment 2 - Agile Software Practice.

Name: Wenlong Lu

## Target Web API.

+ Get /api/users - returns an array of user objects.
+ Post /api/users/ - register a user account or authenticate a user.
+ Put /api/users/:userName - update a specific user.
+ Post /api/users/:userName/favourites - add a movie to favourites of a specific user.
+ Get /api/users/:userName/favourites - get a list of favourites of a specific user.
+ Delete /api/users/:userName/favourites/:id - delete a movie from the favourites list of a specific user
+ Post /api/users/:userName/watchlist - add a movie to watchlist of a specific user.
+ Get /api/users/:userName/watchlist - get a list of watchlist of a specific user.
+ Delete /api/users/:userName/watchlist/:id - delete a movie from the watchlist list of a specific user

+ Get /api/movies - returns an array of movie objects.
+ Get /api/movies/:id - returns detailed information on a specific movie.
+ Post /api/movies - add a new movie to the database. It will generate a random id if the request payload does not inlude id. The title is required.
+ Put /api/movies/:id - update a specific movie. The request payload includes the some/all of the following movie properties to be updated: title, genre list, release date.
+ Delete /api/movies/:id - delete a specific movie. 

+ Get /api/upcomings - returns an array of upcoming movie objects.
+ Get /api/upcomings/:id - returns detailed information on a specific movie.
+ Post /api/upcomings - add a new movie to the upcoming movies database. It will generate a random id if the request payload does not inlude id. The title is required.
+ Put /api/upcomings/:id - update a specific upcoming movie. The request payload includes the some/all of the following movie properties to be updated: title, genre list, release date.
+ Delete /api/upcomings/:id - delete a specific upcoming movie. 

## Error/Exception Testing.

+ Post /api/users - test when password has only number, password has only characters, the length of password is less than 5, nothing is inputed. See tests/functional/api/users/index.js 
+ Put /api/users/:userName - test when username does not exist. See tests/functional/api/users/index.js 
+ Post /api/users/userName/favourites - test when movie is already in favourites, input id is invalid. See tests/functional/api/users/index.js 
+ Delete /api/users/:userName/favourites/:id - test when the movie is not in favourtes,  valid username but invalid movie id, valid movie id but invalid username, invalid username and id. See tests/functional/api/users/index.js 
+ Post /api/users/userName/watchlist - test when movie is already in watchlist, input id is invalid. See tests/functional/api/users/index.js 
+ Delete /api/users/:userName/watchlist/:id - test when the movie is not in watchlist,  valid username but invalid movie id, valid movie id but invalid username, invalid username and id. See tests/functional/api/users/index.js 

+ Get /api/movies/:id - test when the id is not a number, is a number but cannot be found in database. Test getting a movie without prior authentication. See tests/functional/api/movies/index.js 
+ Post /api/movies - test when the new movie has no title, invalid release date, empty genre list. Test adding a movie without prior authentication. See tests/functional/api/movies/index.js 
+ Put /api/movies/:id - test when the id is not a number, is a number but cannot be found in database.  Test updating a movie without prior authentication. See tests/functional/api/movies/index.js 
+ Delete /api/movies/:id - test when the id is not a number, is a number but cannot be found in database. Test deleting a movie without prior authentication. See tests/functional/api/movies/index.js 

+ Get /api/upcomings/:id - test when the id is not a number, is a number but cannot be found in database. Test getting a movie without prior authentication. See tests/functional/api/upcomings/index.js 
+ Post /api/upcomings - test when the new movie has no title, invalid release date, empty genre list. Test adding a movie without prior authentication. See tests/functional/api/upcomings/index.js 
+ Put /api/upcomings/:id - test when the id is not a number, is a number but cannot be found in database.  Test updating a movie without prior authentication. See tests/functional/api/upcomings/index.js 
+ Delete /api/upcomings/:id - test when the id is not a number, is a number but cannot be found in database. Test deleting a movie without prior authentication. See tests/functional/api/upcomings/index.js 

## Continuous Delivery/Deployment.

..... Specify the URLs for the staging and production deployments of your web API, e.g.

+ https://movies-api20091572.herokuapp.com/ - Staging deployment
+ https://movies-api-production20091572.herokuapp.com/ - Production

.... Show a screenshots from the overview page for the two Heroku apps e,g,

+ Staging app overview 

![][stagingapp]

+ Production app overview 

![][productionapp]

[stagingapp]: ./img/stagingapp.png
[productionapp]: ./img/productionapp.png