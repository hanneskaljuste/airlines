import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirportService } from './airport/airport.service';
import { RouteService } from './route/route.service';
import { TravelGraphService } from './travel-graph/travel-graph.service';
import { Utils } from './utils/utils';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        AppService,
        AirportService,
        RouteService,
        TravelGraphService,
        Utils
    ],
})
export class AppModule {}
