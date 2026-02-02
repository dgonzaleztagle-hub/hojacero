# 🧪 Arsenal de ADN Visual HojaCero

Este catálogo define los "Remates Visuales" disponibles para el comando `/factory-alive`. Cada uno responde a una psicología de marca específica.

## 🛠️ Catálogo de Arquetipos

| Arquetipo | Rubro Ideal | Efecto Psicológico | Estado |
| :--- | :--- | :--- | :--- |
| **The Grid** | Arquitectura / Industrial | Orden, Estructura, Precisión | ✅ Ready |
| **The Particle** | Finanzas / Big Data | Dinamismo, Conexión, Flujo | ✅ Ready |
| **The Mesh** | Moda / Lujo / Arte | Suavidad, Exclusividad, Seda | ✅ Ready |
| **The Orb** | Bienestar / Salud / Zen | Respiración, Calma, Humanidad | ✅ Ready |
| **The Vortex** | Logística / Velocidad | Impulso, Futuro, Rapidez | ✅ Ready |
| **The Grain** | Fotografía / Marcas Boutique | Textura, Historia, Calidad | ✅ Ready |
| **The Constellation** | Consultoría / Redes | Inteligencia, Red, Estelar | ✅ Ready |
| **The Liquid** | Bebidas / Energéticos | Adaptabilidad, Frescura | ⏳ Backlog |
| **The Glitch** | Ciberseguridad / Gaming | Disrupción, Alerta, Digital | ⏳ Backlog |
| **The Parallax** | Bienes Raíces / Turismo | Inmersión, Exploración | ⏳ Backlog |

## 📐 Reglas de Oro de Implementación

1. **Resolución Única**: Máximo 1080p para cualquier imagen de apoyo.
2. **Impacto Localizado**: Siempre `relative` y contenido en su sección, nunca `fixed` global a menos que el Soul lo pida.
3. **Optimización de Batería**: Uso estricto de `requestAnimationFrame` con limpieza de memoria en el `unmount`.
4. **Legibilidad Primero**: El efecto es un acompañamiento, NUNCA debe ensuciar el título (H1).

## 🧠 Lógica de Selección (Factory Alive)

- **IF** Cliente == "Serio/Técnico" **USE** (Grid OR Constellation)
- **IF** Cliente == "Creativo/Lujo" **USE** (Mesh OR Grain)
- **IF** Cliente == "Masivo/Rapidez" **USE** (Vortex OR Particle)
- **IF** Cliente == "Humano/Salud" **USE** (Orb)
