import { v2 as cloudinary } from "cloudinary";

// Return "https" URLs by setting secure: true
const config = cloudinary.config({
  secure: true,
});

// Log the configuration
console.log(
  config
    ? `✅ Cloudinary configurado correctamente:`
    : `❌ Error en la configuración de Cloudinary:`
);
console.dir(config);

export default cloudinary;
