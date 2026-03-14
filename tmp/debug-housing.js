
import { geocode } from './lib/territorial/utils/geocoding.js'; // Ajustar ruta si es necesario
import { calculateBoundingBox } from './lib/housing-intel/geo-utils.js';
// Tendré que simular el geocode si no puedo importarlo fácil en un script suelto

async function test() {
    const address = "callejon lo salinas 451, Quilicura";
    console.log("Probando geocodificación...");
    try {
        // En un script de node suelto, importar archivos de Next.js puede ser tedioso por los alias @/
        // Vamos a probar con un fetch directo a la API local si está corriendo
        const response = await fetch("http://localhost:3000/api/housing-intel/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, radius_m: 500 })
        });
        const data = await response.json();
        console.log("Resultado API:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error en test:", e);
    }
}

test();
