import redis from "./redis.js";
import logger from "../logger/logger.js";

const DEFAULT_TTL = 60 * 5;

export const getCache = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await redis.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    } catch (error) {
        logger.error("Cache get error", { key, error });
        return null;
    }
};

export const setCache = async (key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> => {
    try {
        await redis.set(key, JSON.stringify(value), "Ex", ttl);
    } catch (error) {
        logger.error("Cache delete error", { key, error });
    }
};

export const deleteCache = async (key: string): Promise<void> => {
    try {
        await redis.del(key)
    } catch (error) {
        logger.error("Cache delete error", { key, error });
    }
};

export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        logger.error("Cache delete by pattern error", { pattern, error });
    }

};