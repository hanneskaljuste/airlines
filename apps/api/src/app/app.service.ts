import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Airport, Route } from '@sixfold/api-interfaces';
import Graph = require("graph-data-structure");
import { AirportService } from './airport/airport.service';
import { RouteService } from './route/route.service';
import { TravelGraphService } from './travel-graph/travel-graph.service';

@Injectable()
export class AppService implements OnModuleInit {
    private readonly logger = new Logger(AppService.name);

    private initComplete = false;

    constructor(
        private airportService: AirportService,
        private routeService: RouteService,
        private travelGraphService: TravelGraphService) {}

    async onModuleInit() {
        Promise.all([this.airportService.loadAirports(), this.routeService.loadRoutes()]).then(([airports, routes]) => {
            this.travelGraphService.loadTravelGraph(airports, routes, this.airportService.getAirportsMap()).then((result) => {
                this.initComplete = result;
            });
        });
    }


    async getInitComplete() {
        return this.initComplete;
    }

    async getAirports(): Promise<Airport[]> {
        return this.airportService.getAirports();
    }

    async getRoutes(): Promise<Route[]> {
        return this.routeService.getRoutes();
    }

    async getJourney(origin: string, destination: string) {
        return this.travelGraphService.bfs(this.travelGraphService.getTravelGraph(), origin, destination);
    }


}
