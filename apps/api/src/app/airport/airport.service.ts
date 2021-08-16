import { Injectable, Logger } from '@nestjs/common';
import { Airport } from '@sixfold/api-interfaces';
import { CsvHeaders } from '../utils/enums';
import { Utils } from '../utils/utils';

@Injectable()
export class AirportService {
    private readonly logger = new Logger(AirportService.name);
    private airports: Airport[];
    private airportsMap: Map<string, Airport>;
    readonly FILEPATH = `${__dirname}/assets/db/airports.json`;

    constructor(private utils: Utils) {}
    loadAirports(): Promise<Airport[]> {
        return new Promise((resolve) => {
            if (this.utils.fileExistsOnPath(this.FILEPATH)) {
                this.restoreAirportsFromFile(this.FILEPATH).then(airports => {
                    this.setAirports(airports);
                    this.setAirportsMap(this.generateAirportsMap(airports));
                    resolve(airports);
                });
            } else {
                this.utils.readCsvData(CsvHeaders.AIRPORT, 'airports.dat').then(
                    (airports: Airport[]) => {
                        this.setAirports(airports.filter(airport => airport.iata.length > 2));
                        this.setAirportsMap(this.generateAirportsMap(this.getAirports()));
                        this.utils.writeToCache(this.FILEPATH, JSON.stringify(this.getAirports()));
                        resolve(this.getAirports());
                    }
                );
            }
        })
    }

    async restoreAirportsFromFile(path: string): Promise<Airport[]> {
        this.logger.log(`Restoring from file ${path}`);
        return new Promise((resolve) => {
            this.utils.readData(path).then(data => {
                resolve(JSON.parse(data));
            });
        });
    }

    getAirportsCount(): number {
        return this.airports.length;
    }

    setAirports(airports: Airport[]): void {
        this.airports = airports;
    }

    getAirports(): Airport[] {
        return this.airports;
    }

    generateAirportsMap(airports: Airport[]): Map<string, Airport> {
        return this.airports.reduce((acc, airport) => {
            return acc.set(airport.iata, airport);
        }, new Map());
    }
    setAirportsMap(airportsMap: Map<string, Airport>) {
        this.airportsMap = airportsMap;
    }
    getAirportsMap(): Map<string, Airport> {
        return this.airportsMap;
    }

    getAirportByIATA(iata: string): Airport {
        return this.airportsMap.get(iata);
    }
}
