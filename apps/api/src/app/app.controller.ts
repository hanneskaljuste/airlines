import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { Airport, Journey, Route } from '@sixfold/api-interfaces';

import { AppService } from './app.service';
import { Utils } from './utils/utils';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private utils: Utils) {}


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
        if (!this.utils.checkIata(origin) || !this.utils.checkIata(destination)) {
            throw new BadRequestException('Input data incorrect');
        }
        return await this.appService.getJourney(origin.toUpperCase(), destination.toUpperCase());
    }

}
