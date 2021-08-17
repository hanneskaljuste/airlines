import { Injectable, Logger } from '@nestjs/common';
import { CsvHeaders } from './enums';
import * as fs from 'fs';
import * as path from 'path';
import * as csvjson from 'csvjson';
import { LatLon } from '@sixfold/api-interfaces';

@Injectable()
export class Utils {
    private readonly logger = new Logger(Utils.name);

    async readCsvData(headers: CsvHeaders, filename: string) {
        // const headers = this.getHeadersByType(type);
        return new Promise(function (resolve, reject) {
            fs.readFile(path.resolve(__dirname, `./assets/db/${filename}`), 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const options = {
                        headers: headers
                    };
                    const jsonArr = csvjson.toObject(data, options);
                    resolve(jsonArr);
                }
            });
        });
    }

    async readData(path: string): Promise<string> {
        return new Promise((resolve) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                resolve(data)
            });
        })


    }

    fileExistsOnPath(path: string): boolean {
        return fs.existsSync(path);
    }


    calculateProgress(total: number, done: number): number {
        // this.logger.log([total, done]);
        return Math.floor(done / total * 100);
    }

    calculateDistanceBetweePoints(x: LatLon, y: LatLon): number {
        if (!x || !y) {
            return 100000;
        }
        const R = 6371; // km
        const dLat = this.toRad(x.lat - y.lat);
        const dLon = this.toRad(x.lon - y.lon);
        const lat1 = this.toRad(x.lat);
        const lat2 = this.toRad(y.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }

    toRad(Value) {
        return Value * Math.PI / 180;
    }


    writeToCache(fileptah: string, data) {
        fs.writeFile(fileptah, data, (err) => {
            if (err) return this.logger.log(err);
            this.logger.log(`Written to ${fileptah}`);
        });
    }


    checkIata(code: string): boolean {
        return /^[a-zA-Z]{3}$/.test(code);
    }

}
