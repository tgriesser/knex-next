"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let cid = 0;
class KnexConnection {
    constructor(connection) {
        this.connection = connection;
        this.cid = cid + 1;
    }
    toString() {
        return `[KnexConnection ${this.cid}]`;
    }
}
exports.KnexConnection = KnexConnection;
