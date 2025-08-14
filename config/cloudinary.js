import { v2 as cloudinary } from "cloudinary";
import logger from "../logger/index.js";

// Return "https" URLs by setting secure: true
const config = cloudinary.config({
  secure: true,
});

// Log the configuration
config
  ? logger.info(`✅ Cloudinary configurado correctamente`)
  : logger.error(`❌ Error en la configuración de Cloudinary`);

logger.inspectDebug("Configuración de cloudinary:", config);

export default cloudinary;
