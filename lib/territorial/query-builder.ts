export function getSerperQueriesForBusinessType(
  businessType: string,
  comuna: string,
  address: string
): { useSerperScraper: boolean; specificQueries: string[] } {
  switch (businessType) {
    case 'restaurant':
      return {
        useSerperScraper: true,
        specificQueries: [
          `sushi en ${comuna}, Chile`,
          `comida china en ${comuna}, Chile`,
          `comida coreana en ${comuna}, Chile`,
          `pizzería en ${comuna}, Chile`,
          `hamburguesas en ${comuna}, Chile`,
          `pollo asado en ${comuna}, Chile`,
          `comida mexicana en ${comuna}, Chile`,
          `comida peruana en ${comuna}, Chile`,
          `comida saludable en ${comuna}, Chile`,
          `restaurantes cerca de ${address}`
        ]
      };

    case 'fast_food':
      return {
        useSerperScraper: true,
        specificQueries: [
          `hamburguesas en ${comuna}, Chile`,
          `pollo asado en ${comuna}, Chile`,
          `completos en ${comuna}, Chile`,
          `sandwicherías en ${comuna}, Chile`,
          `pizzería en ${comuna}, Chile`,
          `comida rápida en ${comuna}, Chile`,
          `fast food cerca de ${address}`
        ]
      };

    case 'cafe':
      return {
        useSerperScraper: true,
        specificQueries: [
          `cafeterías en ${comuna}, Chile`,
          `cafés en ${comuna}, Chile`,
          `heladerías en ${comuna}, Chile`,
          `pastelerías en ${comuna}, Chile`,
          `coffee shop en ${comuna}, Chile`
        ]
      };

    case 'bakery':
      return {
        useSerperScraper: true,
        specificQueries: [
          `panaderías en ${comuna}, Chile`,
          `pastelerías en ${comuna}, Chile`,
          `reposterías en ${comuna}, Chile`
        ]
      };

    case 'pharmacy':
      return {
        useSerperScraper: true,
        specificQueries: [
          `farmacias en ${comuna}, Chile`,
          `Cruz Verde en ${comuna}, Chile`,
          `Salcobrand en ${comuna}, Chile`,
          `Ahumada en ${comuna}, Chile`
        ]
      };

    case 'gym':
      return {
        useSerperScraper: true,
        specificQueries: [
          `gimnasios en ${comuna}, Chile`,
          `centros de entrenamiento en ${comuna}, Chile`,
          `fitness en ${comuna}, Chile`
        ]
      };

    case 'supermarket':
      return {
        useSerperScraper: true,
        specificQueries: [
          `minimarket en ${comuna}, Chile`,
          `supermercados en ${comuna}, Chile`,
          `almacenes en ${comuna}, Chile`
        ]
      };

    case 'hairdresser':
      return {
        useSerperScraper: true,
        specificQueries: [
          `peluquerías en ${comuna}, Chile`,
          `barberías en ${comuna}, Chile`,
          `salones de belleza en ${comuna}, Chile`
        ]
      };

    case 'beauty':
      return {
        useSerperScraper: true,
        specificQueries: [
          `centros de estética en ${comuna}, Chile`,
          `spa en ${comuna}, Chile`,
          `salones de belleza en ${comuna}, Chile`
        ]
      };

    case 'dental':
      return {
        useSerperScraper: true,
        specificQueries: [
          `clínicas dentales en ${comuna}, Chile`,
          `dentistas en ${comuna}, Chile`,
          `odontólogos en ${comuna}, Chile`
        ]
      };

    case 'medical':
      return {
        useSerperScraper: true,
        specificQueries: [
          `centros médicos en ${comuna}, Chile`,
          `clínicas en ${comuna}, Chile`,
          `consultorios en ${comuna}, Chile`
        ]
      };

    case 'veterinary':
      return {
        useSerperScraper: true,
        specificQueries: [
          `veterinarias en ${comuna}, Chile`,
          `clínicas veterinarias en ${comuna}, Chile`
        ]
      };

    case 'hardware':
      return {
        useSerperScraper: true,
        specificQueries: [
          `ferreterías en ${comuna}, Chile`,
          `materiales de construcción en ${comuna}, Chile`
        ]
      };

    case 'bookstore':
      return {
        useSerperScraper: true,
        specificQueries: [
          `librerías en ${comuna}, Chile`,
          `papelerías en ${comuna}, Chile`
        ]
      };

    case 'optics':
      return {
        useSerperScraper: true,
        specificQueries: [
          `ópticas en ${comuna}, Chile`
        ]
      };

    case 'clothes':
      return {
        useSerperScraper: true,
        specificQueries: [
          `tiendas de ropa en ${comuna}, Chile`,
          `boutiques en ${comuna}, Chile`
        ]
      };

    case 'car_service':
      return {
        useSerperScraper: true,
        specificQueries: [
          `talleres mecánicos en ${comuna}, Chile`,
          `mecánicas en ${comuna}, Chile`
        ]
      };

    case 'laundry':
      return {
        useSerperScraper: true,
        specificQueries: [
          `lavanderías en ${comuna}, Chile`,
          `tintorerías en ${comuna}, Chile`
        ]
      };

    case 'pet_store':
      return {
        useSerperScraper: true,
        specificQueries: [
          `tiendas de mascotas en ${comuna}, Chile`,
          `pet shop en ${comuna}, Chile`
        ]
      };

    case 'florist':
      return {
        useSerperScraper: true,
        specificQueries: [
          `floristerías en ${comuna}, Chile`,
          `flores en ${comuna}, Chile`
        ]
      };

    default:
      return { useSerperScraper: false, specificQueries: [] };
  }
}
