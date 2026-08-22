# ⚡ Pokédex Next-Gen — Base de Datos de Pokémon

<p align="center">
  <a href="https://frankusqabant.github.io/PokeAPI/" target="_blank" rel="noopener noreferrer">
    <img src="img/preview.webp" alt="Vista Previa de Pokédex — Clic para abrir en vivo" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  </a>
</p>

<p align="center">
  <a href="https://frankusqabant.github.io/PokeAPI/">
    <img src="https://img.shields.io/badge/Demo_en_Vivo-GitHub_Pages-10b981?style=for-the-badge&logo=githubpages&logoColor=white" alt="Demo en Vivo">
  </a>
  <img src="https://img.shields.io/badge/Pok%C3%A9mon-151_Kanto-ef4444?style=for-the-badge&logo=pokemon" alt="151 Kanto">
  <img src="https://img.shields.io/badge/API-Pok%C3%A9API_v2-ffcb05?style=for-the-badge&logo=javascript&logoColor=black" alt="PokéAPI">
  <img src="https://img.shields.io/badge/Estilo-Holographic_CSS-00F5D4?style=for-the-badge&logo=css3&logoColor=black" alt="CSS3">
  <img src="https://img.shields.io/badge/Modo-Dark_%26_Light-8b5cf6?style=for-the-badge" alt="Temas">
</p>

<p align="center">
  🌐 <b>Sitio Web Desplegado:</b> <a href="https://frankusqabant.github.io/PokeAPI/">https://frankusqabant.github.io/PokeAPI/</a>
</p>

---

## 🚀 Descripción General

Una aplicación web moderna, interactiva y de alto rendimiento que consulta la API oficial de **PokéAPI** para explorar los 151 Pokémon de la primera generación (Kanto).

Incluye arquitectura con **carga ordenada concurrente** (`Promise.all`), **caché en memoria** para filtrado instantáneo (0 ms), buscador en tiempo real por texto o número, modal con estadísticas de combate detalladas y alternador de versión Normal / Shiny.

---

## ✨ Características Principales

- ⚡ **Rendimiento Instantáneo:** Carga ordenada del #001 al #151 con caché en memoria (sin peticiones redundantes a la red).
- 🔍 **Buscador en Tiempo Real:** Filtrado simultáneo por nombre y número de Pokédex.
- 🎨 **Tarjetas con Colores de Tipo:** Bordes dinámicos con resplandor neón adaptados al tipo de cada criatura (Fuego, Agua, Planta, Eléctrico, Dragón, etc.).
- 📊 **Modal de Estadísticas:** Barras de combate (HP, Ataque, Defensa, Velocidad, etc.), altura, peso, habilidades y switch para ver la versión **Shiny ✨**.
- 🌓 **Modo Oscuro & Claro:** Selector de tema accesible con persistencia en `localStorage`.
- 📱 **Diseño 100% Responsivo:** Adaptado a móviles, tablets y pantallas de escritorio.

---

## 🛠️ Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/FrankUsqAbant/PokeAPI.git
cd PokeAPI

# 2. Iniciar servidor local
npx -y serve -p 3001
```

Abre **[http://localhost:3001](http://localhost:3001)** en tu navegador.

---

## 📂 Estructura del Proyecto

```text
PokeAPI/
├── .github/workflows/deploy.yml # Pipeline de despliegue a GitHub Pages
├── css/main.css                 # Sistema de diseño, variables y temas
├── js/main.js                   # Lógica de carga, caché, búsqueda y modal
├── img/                         # Logo, fondos y vistas previas en WebP
├── index.html                   # Interfaz de usuario estructurada
└── README.md                    # Documentación
```

---

## 📄 Licencia y Créditos

- Datos proporcionados por la API pública de [PokéAPI](https://pokeapi.co/).
- Pokémon y sus personajes son marcas registradas de Nintendo, Game Freak y Creatures Inc.
