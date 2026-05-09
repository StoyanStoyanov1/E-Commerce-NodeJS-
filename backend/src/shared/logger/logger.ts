import winston from "winston";

const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    http: 3,
    info: 4,
    debug: 5,
};

const logger = winston.createLogger({
    levels,
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
                })
            )
        }),
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ]
});

export default logger;