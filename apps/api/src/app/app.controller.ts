import { Controller, Get, Param } from '@nestjs/common';

import { Airport, Journey, Route } from '@sixfold/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}


    @Get('status')
    getStatus(): Promise<boolean> {
        return this.appService.getInitComplete();
    }


    @Get('airports')
    getAirports(): Promise<Airport[]> {
        return this.appService.getAirports();
    }

    @Get('routes')
    getRoutes(): Promise<Route[]> {
        return this.appService.getRoutes();
    }


    @Get('journey/:origin/:destination')
    async getGraph(@Param('origin') origin: string, @Param('destination') destination: string): Promise<Journey> {
        return await this.appService.getJourney(origin, destination);
    }

}
