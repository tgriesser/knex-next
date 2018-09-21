"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function knexExpress(knex, options) {
    return (req, res, next) => {
        return next();
    };
}
exports.knexExpress = knexExpress;
