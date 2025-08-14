import winstonLogger from "../config/logger.js";
import util from "util";

class Logger {
  // Métodos básicos con correlation ID automático
  debug(message, meta = {}) {
    winstonLogger.debug(message, meta);
  }

  info(message, meta = {}) {
    winstonLogger.info(message, meta);
  }

  warn(message, meta = {}) {
    winstonLogger.warn(message, meta);
  }

  error(message, errorOrMeta, meta = {}) {
    if (errorOrMeta instanceof Error) {
      winstonLogger.error(message, {
        error: errorOrMeta.message,
        stack: errorOrMeta.stack,
        ...meta,
      });
    } else {
      winstonLogger.error(message, errorOrMeta || {});
    }
  }

  // Método para inspeccionar objetos con formato (equivalente a console.dir)
  inspect(message, obj, meta = {}, options = {}) {
    const defaultOptions = {
      depth: null,
      colors: false,
      showHidden: false,
      compact: false,
    };

    const inspectOptions = { ...defaultOptions, ...options };
    const formattedObj = util.inspect(obj, inspectOptions);

    winstonLogger.info(`${message}\n${formattedObj}`, meta);
  }

  // Versión con nivel específico
  inspectDebug(message, obj, meta = {}, options = {}) {
    const defaultOptions = {
      depth: null,
      colors: true,
      showHidden: false,
      compact: false,
    };

    const inspectOptions = { ...defaultOptions, ...options };
    const formattedObj = util.inspect(obj, inspectOptions);

    winstonLogger.debug(`${message}\n${formattedObj}`, meta);
  }

  inspectWarn(message, obj, meta = {}, options = {}) {
    const defaultOptions = {
      depth: null,
      colors: false,
      showHidden: false,
      compact: false,
    };

    const inspectOptions = { ...defaultOptions, ...options };
    const formattedObj = util.inspect(obj, inspectOptions);

    winstonLogger.warn(`${message}\n${formattedObj}`, meta);
  }

  inspectError(message, obj, meta = {}, options = {}) {
    const defaultOptions = {
      depth: null,
      colors: false,
      showHidden: false,
      compact: false,
    };

    const inspectOptions = { ...defaultOptions, ...options };
    const formattedObj = util.inspect(obj, inspectOptions);

    winstonLogger.error(`${message}\n${formattedObj}`, meta);
  }

  // Logging específico para HTTP requests
  httpStart(req) {
    this.info("🚀 Request started", {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent")?.substring(0, 100),
    });
  }

  httpEnd(req, res, responseTime) {
    const level = res.statusCode >= 400 ? "warn" : "info";
    const emoji = res.statusCode >= 400 ? "❌" : "✅";

    this[level](`${emoji} Request completed`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    });
  }
}

export default new Logger();
