## Development server

Project is in nx workspace, generated with npx create-nx-workspace and contains nestjs API server and Angular webapp.

## Installation

Run `npm install`

### API

Run `nx serve api` (or with local nx `./node_modules/.bin/nx serve api`)

Example journey calculation: <http://localhost:3333/api/journey/TLL/BCN>

### Webapp

Run `nx serve` (or with local nx `./node_modules/.bin/nx serve`) then head to <http://localhost:4200>

## Data used

Airports: <https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat>

Routes: <https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat>

Airports without IATA code are removed from list. (Routes are only IATA based).

Search also implemented only using IATA codes.
