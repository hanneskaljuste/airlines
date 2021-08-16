import { Injectable } from '@nestjs/common';
import { Route } from '@sixfold/api-interfaces';
import { CsvHeaders } from '../utils/enums';
import { Utils } from '../utils/utils';

@Injectable()
export class RouteService {
    private routes: Route[] = [];
    constructor(private utils: Utils) {}
    loadRoutes(): Promise<Route[]> {
        return new Promise((resolve) => {
            this.utils.readCsvData(CsvHeaders.ROUTE, 'routes.dat').then(
                (routes: Route[]) => {
                    this.setRoutes(routes);
                    resolve(routes);
                }
            );
        });
    }
    setRoutes(routes: Route[]) {
        this.routes = routes;
    }
    getRoutes(): Route[] {
        return this.routes;
    }
}
