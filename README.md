Freader
=======

Now that Google Reader is over, why not use an open source Feed Reader !
Freader provides you with a simple page with all your feeds and the last item in them.
You cannot read articles inside the application for now but it's on the TODO list !

You can see it in action in a little Heroku app [here](http://freader-rss.herokuapp.com/)!
Account creation takes about 10 seconds. Try it!

Features
--------

* All your feeds in a clear (and flat) UI
* All written with Node.js and Angular.js
* User management (creation, removing)
* Feed caching (one hour by default)

Requirement
-----------

* [Node.js](http://nodejs.org/)
* [MongoDB](http://www.mongodb.org/)

Installation
------------

* Clone this repo
* Install dependencies with 'npm install'
* Start your MongoDB server with `mongod` (modify the address if you need to in the config file)
* Start the server with `npm start`
* You can now create a user and start adding feeds by connecting to localhost:3000 (you can change the port inside the config file)

Used
----

* [Angular.js](http://angularjs.org/)
* [Bootstrap](http://twitter.github.io/bootstrap/)
* [FlatUI by Designmodo](http://designmodo.github.io/Flat-UI/)

TODO
----

* Add organization on feeds with tabs / categories
* Get back the favicon from the feed
* Clean and remove CSS in Bootstrap / Flat UI to keep only what's used
* Show the article directly in the application
* Improve the design and UX in general
* Implement 'Forgot Password?' feature
* Keep track of the current state of articles : to reed / reeded
* Add a view with every articles of every feeds

About the creator
-----------------

I'm [Guillaume Besson](http://besson.co/) (AKA Geekuillaume), a young and passionate French developer.
You can contact me on [Twitter](http://twitter.com/geekuillaume) or by [email](mailto:guillaume@besson.com).

License
-------

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
