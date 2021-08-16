export interface LatLon {
    lat: number;
    lon: number;
}


export interface Airport extends LatLon {
    id: string;
    name: string;
    city: string;
    country: string;
    iata: string | null;
    icao: string | null;
    altitude: number;
    timezone: string;
    DST: string;
    tz_database: string;
    source: string;
    routes: Route[];

}


export interface Route {
    airline: string;
    airline_id: string;
    source_airport: string;
    source_airport_id: string;
    destination_airport: string;
    destination_airport_id: string;
    codeshar: string;
    stops: number;
    equipment: string;
}


export interface Journey {
    distance: number;
    steps: Airport[];
}
