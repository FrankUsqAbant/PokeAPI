# ⚡ Pokédex Next-Gen — Base de Datos de Pokémon

<p align="center">
  <a href="https://frankusqabant.github.io/PokeAPI/" target="_blank" rel="noopener noreferrer">
    <img src="img/preview.webp" alt="Vista Previa de Pokédex — Clic para abrir en vivo" width="100%" style="border-radius: 12px; box-shadow: 0 12px 36px rgba(0,0,0,0.6);">
  </a>
</p>

<p align="center">
  <a href="https://frankusqabant.github.io/PokeAPI/">
    <img src="https://img.shields.io/badge/Demo_en_Vivo-GitHub_Pages-10b981?style=for-the-badge&logo=githubpages&logoColor=white" alt="Demo en Vivo">
  </a>
  <img src="https://img.shields.io/badge/Pok%C3%A9mon-151_Kanto-ef4444?style=for-the-badge&logo=pokemon" alt="151 Kanto">
  <img src="https://img.shields.io/badge/API-Pok%C3%A9API_v2-ffcb05?style=for-the-badge&logo=javascript&logoColor=black" alt="PokéAPI">
  <img src="https://img.shields.io/badge/Estilo-Holographic_CSS-00F5D4?style=for-the-badge&logo=css3&logoColor=black" alt="CSS3">
  <img src="https://img.shields.io/badge/Temas-Dark_%26_Light-8b5cf6?style=for-the-badge" alt="Temas">
</p>

<p align="center">
  🌐 <b>Sitio Web Desplegado:</b> <a href="https://frankusqabant.github.io/PokeAPI/">https://frankusqabant.github.io/PokeAPI/</a>
</p>

---

## 🚀 Descripción General

**Pokédex Next-Gen** es una aplicación web moderna, interactiva y de alto rendimiento que consulta la API oficial de **PokéAPI** para explorar los 151 Pokémon de la región de Kanto.

Cuenta con una **Portada Hero cinematográfica**, arquitectura con **carga ordenada concurrente** (`Promise.all`), **caché en memoria** para filtrado y búsqueda instantánea (0 ms), cabecera retráctil con disparador flotante de Pokéball y un modal detallado de estadísticas con alternador de versión **Shiny ✨**.

---

## ✨ Características Principales

- 🎬 **Portada Hero de Bienvenida:** Presentación visual con artwork de starters de Kanto y botón para descubrir un Pokémon aleatorio.
- ⚡ **Rendimiento Instantáneo:** Carga garantizada del #001 al #151 con caché en memoria (sin peticiones de red redundantes).
- 🔍 **Buscador en Tiempo Real:** Filtrado simultáneo y reactivo por nombre o número de Pokédex.
- 🎛️ **Cabecera Retráctil Inteligente:** Se auto-oculta al hacer scroll para maximizar la pantalla y se invoca fácilmente con el botón flotante de Pokéball.
- 🎨 **Tarjetas con Colores de Tipo:** Iluminación neón adaptativa según el elemento de cada Pokémon (Fuego, Agua, Planta, Eléctrico, Dragón, etc.).
- 📊 **Modal de Estadísticas de Combate:** Gráficos de barras (HP, Ataque, Defensa, Velocidad), peso, altura, habilidades y switch Shiny.
- 🌓 **Modo Oscuro & Claro:** Selector de tema accesible con persistencia en `localStorage`.

---

## 📂 Estructura del Repositorio

```text
PokeAPI/
├── .github/workflows/deploy.yml # Pipeline CI/CD para GitHub Pages
├── css/main.css                 # Sistema de diseño, variables y temas
├── js/main.js                   # Lógica de carga ordenada, caché, filtros y modal
├── img/                         # Logo, fondos y capturas en WebP ultraligero
├── index.html                   # Interfaz semántica estructurada
└── README.md                    # Documentación del proyecto
```

---

## 📄 Créditos y Licencia

- Datos obtenidos de la API pública oficial de [PokéAPI](https://pokeapi.co/).
- Pokémon y sus personajes son marcas registradas de Nintendo, Game Freak y Creatures Inc.
