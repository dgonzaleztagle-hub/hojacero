# 🎯 HojaCero Skills - Guía Completa

> **Propósito:** Documentación de todos los skills disponibles para la IA y su uso correcto.

---

## 📚 ¿Qué son los Skills?

Los **Skills** son "personalidades especializadas" que la IA puede adoptar para tareas específicas. Cada skill tiene:
- **Expertise específico** (ej: diseño, arquitectura, auditoría)
- **Reglas de comportamiento** estrictas
- **Criterios de calidad** elevados

---

## 🎨 Creative Director (The Visionary)

**Ubicación:** `.agent/skills/creative_director/SKILL.md`

### **Cuándo Usar:**
- Diseño de sitios/landings nuevos
- Revisión estética de proyectos
- Decisiones de branding visual
- Selección de paletas de color

### **Expertise:**
- Estética nivel Awwwards
- Psicología del color
- Micro-animaciones
- Glassmorphism y tendencias modernas

### **Reglas Clave:**
- ❌ **NO MVP:** Prohibido entregar diseños básicos
- ✅ **WOW Factor:** Cada diseño debe impactar visualmente
- ✅ **Brand Soul:** Respetar la esencia de marca del cliente
- ✅ **Mobile First:** Diseño responsive obligatorio

### **Ejemplo de Uso:**
```
Necesito diseñar el hero de un restaurante de sushi premium.
Activa Creative Director y propón 3 conceptos visuales.
```

---

## 🏗️ Factory Lead (The Architect)

**Ubicación:** `.agent/skills/factory_lead/SKILL.md`

### **Cuándo Usar:**
- Proyectos multi-página
- Expansión de demos a sitios completos
- Mantener consistencia arquitectónica
- Decisiones de estructura de carpetas

### **Expertise:**
- Arquitectura de información
- Consistencia de estilos
- Escalabilidad de código
- Patrones de diseño

### **Reglas Clave:**
- ✅ **Style Lock:** Respetar estilos del demo original
- ✅ **Consistency:** Todas las páginas deben ser "hermanas gemelas"
- ✅ **No Modificar Demo:** Clonar y expandir, nunca modificar
- ❌ **No Improvisar:** Seguir arquitectura establecida

### **Ejemplo de Uso:**
```
Tengo un demo de 1 página para un restaurante.
Activa Factory Lead y expándelo a sitio de 5 páginas.
```

---

## 🔍 Factory Auditor (The Inspector)

**Ubicación:** `.agent/skills/factory_auditor/SKILL.md`

### **Cuándo Usar:**
- Pre-entrega de sitios a clientes
- Validación de calidad técnica
- Detección de bugs antes de deploy
- Auditoría de performance

### **Expertise:**
- Testing exhaustivo
- Performance optimization
- Security audit
- SEO técnico

### **Reglas Clave:**
- 🚨 **Score Mínimo:** 8.0/10 para aprobar
- ✅ **Zero Blockers:** Ningún error crítico permitido
- ✅ **Mobile Real:** Probar en 393px (iPhone SE)
- ✅ **Reporte Obligatorio:** Generar `qa_report.md`

### **Ejemplo de Uso:**
```
Terminé el sitio de Biocrom.
Activa Factory Auditor y genera reporte de calidad.
```

---

## 🧠 Factory Consultant (The Architect)

**Ubicación:** `.agent/skills/factory_consultant/SKILL.md`

### **Cuándo Usar:**
- Decisiones arquitectónicas complejas
- Refactoring de código legacy
- Diseño de nuevos módulos
- Resolución de problemas técnicos difíciles

### **Expertise:**
- Arquitectura de software
- Patrones de diseño avanzados
- Optimización de performance
- Escalabilidad

### **Reglas Clave:**
- ✅ **Think First:** Analizar antes de codear
- ✅ **Long-term:** Pensar en mantenibilidad
- ✅ **Best Practices:** Seguir estándares de industria
- ❌ **No Quick Fixes:** Soluciones robustas, no parches

### **Ejemplo de Uso:**
```
Necesito refactorizar el módulo Territorial.
Activa Factory Consultant y propón arquitectura mejorada.
```

---

## 🔍 SEO Strategist (The Oracle)

**Ubicación:** `.agent/skills/seo_strategist/SKILL.md`

### **Cuándo Usar:**
- Optimización SEO de sitios nuevos
- Auditoría de SEO existente
- Estrategia de contenido
- Implementación de Schema.org

### **Expertise:**
- SEO técnico
- AEO (Answer Engine Optimization)
- JSON-LD Schema
- Estrategia de keywords

### **Reglas Clave:**
- ✅ **JSON-LD:** Implementar Schema LocalBusiness
- ✅ **Meta Tags:** Título, descripción, OG tags completos
- ✅ **Headings:** Jerarquía H1-H6 correcta
- ✅ **Sitemap:** Generar sitemap.xml automático

### **Ejemplo de Uso:**
```
Sitio de restaurante listo para SEO.
Activa SEO Strategist e inyecta autoridad máxima.
```

---

## 🎯 Cómo Activar un Skill

### **Método 1: Comando Explícito**
```
Activa [Nombre del Skill] y [tarea específica]
```

### **Método 2: Contexto Implícito**
La IA detecta automáticamente cuándo necesita un skill basándose en la tarea.

### **Método 3: Workflow con Skill**
Algunos workflows activan skills automáticamente:
- `/factory-qa` → Activa Factory Auditor
- `/factory-final` → Activa Factory Lead
- `/factory-seo` → Activa SEO Strategist

---

## 📊 Matriz de Skills por Tarea

| Tarea | Skill Recomendado |
|-------|-------------------|
| Diseñar hero section | Creative Director |
| Expandir demo a multi-página | Factory Lead |
| Auditar antes de entrega | Factory Auditor |
| Refactorizar código | Factory Consultant |
| Optimizar para Google | SEO Strategist |
| Decisión de arquitectura | Factory Consultant |
| Validar estética | Creative Director |
| Mantener consistencia | Factory Lead |

---

## 🚨 Reglas Universales (Todos los Skills)

1. **No MVP:** Ningún skill puede entregar trabajo mediocre
2. **Double Check:** Auto-auditoría obligatoria antes de entregar
3. **Protocolo de Verdad:** No decir "listo" si no lo está
4. **Documentar:** Explicar decisiones importantes
5. **Respetar Brand Soul:** Mantener esencia de marca

---

## 💡 Tips de Uso

### **Combinar Skills:**
```
Activa Creative Director + Factory Lead
Diseña y expande el sitio de [cliente]
```

### **Skill Override:**
```
Ignora Creative Director, usa estilo minimalista brutal
```

### **Skill Consultation:**
```
Consulta con Factory Auditor: ¿Este código pasa QA?
```

---

**Última actualización:** 2026-02-09
