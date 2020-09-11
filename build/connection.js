"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const mongoose = require("mongoose");
const redis = require("async-redis");
const { MONGODB_URI, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
exports.redisClient = redis.createClient({
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT),
    password: REDIS_PASSWORD,
});
const mongooseConnection = mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
function waitConnection() {
    return new Promise((resolve, reject) => {
        exports.redisClient.on('error', reject);
        exports.redisClient.on('ready', () => {
            mongooseConnection.then(() => resolve()).catch(reject);
        });
    });
}
exports.default = waitConnection;
//# sourceMappingURL=connection.js.map