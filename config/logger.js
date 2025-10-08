import winston from "winston";
import httpContext from "express-http-context";
import { NODE_ENV } from "./env.js";
import DailyRotateFile from "winston-daily-rotate-file";
import util from "util";
import fs from "fs";

// Crear carpetas de año/mes/dia antes de inicializar Winston
const createYearMonthDirectories = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const dirs = [
    "logs",
    `logs/${year}`,
    `logs/${year}/${month}`,
    `logs/${year}/${month}/${day}`,
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Crear las carpetas necesarias
//createYearMonthDirectories();

/* // crear directorio de logs
const dir = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `logs/${year}/${month}/${day}`;
};
*/

// Formato personalizado
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const correlationId = httpContext.get("correlationId") || "no-id";
    let log = `[${timestamp}] [${level.toUpperCase()}] [${correlationId}] ${message}`;

    if (Object.keys(meta).length > 0) {
      const cleanMeta = { ...meta };
      delete cleanMeta.timestamp;
      delete cleanMeta.level;
      delete cleanMeta.message;

      if (Object.keys(cleanMeta).length > 0) {
        log += ` | ${JSON.stringify(cleanMeta)}`;
      }
    }

    return log;
  })
);

// Logger
const winstonLogger = winston.createLogger({
  level: NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console(),

    /* // generar logs de archivo
    new DailyRotateFile({
      dirname: dir(),
      filename: "app_%DATE%.log",
      auditFile: `${dir()}/app-audit.json`,
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "31d",
    }),

    new DailyRotateFile({
      dirname: dir(),
      filename: "error_%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "90d",
      auditFile: `${dir()}/error-audit.json`,
    }),
    */
  ],
});

export default winstonLogger;
