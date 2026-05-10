import Redis from "ioredis";
import logger from "../logger/logger.js";

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
});

redis.on("connect", () => logger.info("Redis Connected"));
redis.on("error", (err) => logger.error(`Redis Error: ${err}`));

export default redis;