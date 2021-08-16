import { Injectable, Logger } from '@nestjs/common';
import { Airport, Journey, Route } from '@sixfold/api-interfaces';
import Graph = require('graph-data-structure');
import { AirportService } from '../airport/airport.service';
import { RouteService } from '../route/route.service';
import { Utils } from '../utils/utils';

@Injectable()
export class TravelGraphService {
    private readonly logger = new Logger(TravelGraphService.name);
    private graph = Graph();

    readonly FILEPATH = `${__dirname}/assets/db/travelgraph.json`;

    constructor(private utils: Utils, private airportService: AirportService, private routeService: RouteService) {}

    async loadTravelGraph(airports: Airport[], routes: Route[], airportsMap): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.utils.fileExistsOnPath(this.FILEPATH)) {
                this.restoreGraphFromFile(this.FILEPATH).then(graph => {
                    this.setTravelGraph(graph);
                    resolve(true);
                });
            } else {
                this.generateTravelGraph(airports, routes, airportsMap).then(graph => {
                    this.setTravelGraph(graph);
                    this.utils.writeToCache(this.FILEPATH, JSON.stringify(graph.serialize()));
                    resolve(true);
                })
            }
        });
    }

    async generateTravelGraph(airports: Airport[], routes: Route[], airportsMap: Map<string, Airport>): Promise<any> {
        return new Promise((resolve) => {
            let counter = 0;
            let lastProgress = 0;
            const edgeCheck = new Set();
            const g = Graph();
            this.logger.log(`Generating graph: 0 %`);
            airports.forEach((airport: Airport) => {
                counter++;
                g.addNode(airport.iata);
                const progress = this.utils.calculateProgress(airports.length, counter);
                if (progress % 5 === 0 && progress !== lastProgress) {
                    this.logger.log(`Generating graph: ${progress} %`);
                    lastProgress = progress;
                }
                routes.forEach((route: Route) => {
                    if (!edgeCheck.has(route.source_airport + route.destination_airport) && airport.iata === route.source_airport && airportsMap.has(route.destination_airport)) {
                        edgeCheck.add(route.source_airport + route.destination_airport);
                        g.addEdge(route.source_airport, route.destination_airport, this.utils.calculateDistanceBetweePoints(airportsMap[route.source_airport], airportsMap.get(route.destination_airport)));
                    }
                });
            });
            this.logger.log(`Generating graph: DONE`);
            resolve(g);
        });

    }


    async restoreGraphFromFile(path: string): Promise<any> {
        this.logger.log(`Restoring from file ${path}`);
        return new Promise((resolve) => {
            this.utils.readData(path).then(data => {
                resolve(this.graph.deserialize(JSON.parse(data)))
            });
        });
    }

    setTravelGraph(graph) {
        this.graph = graph;
    }
    getTravelGraph() {
        return this.graph;
    }




    async bfs(graph, origin: string, destination: string): Promise<Journey> {
        let bestResult = null;
        let queue = [{ nodes: [origin], distance: 0, hopsAvailable: 6 }];
        const visited = [];
        let currentBest = 100000000;
        while (queue.length > 0) {
            const path = queue.shift();
            const node = path.nodes[path.nodes.length - 1];
            queue = this.calcQueue(graph, node, path, queue, visited, currentBest);
            if (node === destination) {
                if (currentBest > path.distance) {
                    currentBest = path.distance;
                    bestResult = path;
                }
            }
            visited.push(node);
        }
        if (!bestResult) {
            return {
                distance: 0,
                steps: []
            };
        }
        return {
            distance: Math.floor(bestResult.distance),
            steps: bestResult.nodes.map(node => this.airportService.getAirportByIATA(node))
        }
    }

    calcQueue(graph, node, path, queue, visited, currentBest) {
        graph.adjacent(node).forEach(adjacent => {
            if (visited.indexOf(adjacent) < 0) {
                const newPath = {
                    nodes: [...path.nodes, adjacent],
                    distance: path.distance + graph.getEdgeWeight(node, adjacent),
                    hopsAvailable: path.hopsAvailable
                };
                if (newPath.hopsAvailable > 0 && currentBest > newPath.distance) {
                    newPath.hopsAvailable = newPath.hopsAvailable--;
                    queue.push(newPath);
                }
            }
        });
        return queue;

    }
}
