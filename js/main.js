/**
 * POKÉDEX NEXT-GEN — LÓGICA INTERACTIVA Y RENDIMIENTO
 * Carga en memoria, filtros instantáneos, buscador en vivo, cabecera retráctil y modal de stats
 */

const POKEMON_TOTAL = 151;
const API_URL = "https://pokeapi.co/api/v2/pokemon/";

// Estado en memoria
let pokemonCache = [];
let filtroTipoActual = "ver-todos";
let terminoBusqueda = "";

// Elementos del DOM
const listaPokemon = document.getElementById("listaPokemon");
const loadingSpinner = document.getElementById("loading-spinner");
const sinResultados = document.getElementById("sin-resultados");
const inputBuscar = document.getElementById("input-buscar");
const btnLimpiar = document.getElementById("btn-limpiar");
const contadorTexto = document.getElementById("contador-texto");
const botonesHeader = document.querySelectorAll(".btn-header");
const themeToggle = document.getElementById("theme-toggle");
const modalOverlay = document.getElementById("pokemon-modal");
const modalDetalle = document.getElementById("modal-detalle");
const modalBtnCerrar = document.getElementById("modal-btn-cerrar");

// Cabecera retráctil
const mainHeader = document.getElementById("main-header");
const btnToggleHeader = document.getElementById("btn-toggle-header");
const btnOcultarHeader = document.getElementById("btn-ocultar-header");

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initHeaderControls();
  initEventListeners();
  initMovimientoTarjetas();
  initHeroVivo();
  cargarTodosLosPokemon();
});

/* --------------------------------------------------------------------------
   1. CONTROL INTELIGENTE DE CABECERA RETRÁCTIL
   -------------------------------------------------------------------------- */
function initHeaderControls() {
  let lastScrollY = window.scrollY;

  function ocultarCabecera() {
    mainHeader.classList.add("hidden");
    btnToggleHeader.classList.add("visible");
  }

  function mostrarCabecera() {
    mainHeader.classList.remove("hidden");
    btnToggleHeader.classList.remove("visible");
  }

  if (btnOcultarHeader) {
    btnOcultarHeader.addEventListener("click", ocultarCabecera);
  }

  if (btnToggleHeader) {
    btnToggleHeader.addEventListener("click", () => {
      if (mainHeader.classList.contains("hidden")) {
        mostrarCabecera();
      } else {
        ocultarCabecera();
      }
    });
  }

  // Ocultar al deslizar hacia abajo, mostrar al deslizar hacia arriba
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 150 && currentScrollY > lastScrollY) {
      // Scroll hacia abajo
      ocultarCabecera();
    } else if (currentScrollY < lastScrollY - 20 || currentScrollY <= 50) {
      // Scroll hacia arriba o cerca del tope
      mostrarCabecera();
    }
    lastScrollY = currentScrollY;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. CARGA INICIAL CONCURRENTE Y ORDENADA
   -------------------------------------------------------------------------- */
async function cargarTodosLosPokemon() {
  try {
    // 1) Datos estáticos del propio sitio (rápido y cacheable); 2) respaldo: PokéAPI
    let resultados = null;
    try {
      const res = await fetch("data/pokedex.json");
      if (res.ok) {
        resultados = await res.json();
        if (!Array.isArray(resultados) || resultados.length !== POKEMON_TOTAL) resultados = null;
      }
    } catch (_) { resultados = null; }

    if (!resultados) {
      const promesas = [];
      for (let i = 1; i <= POKEMON_TOTAL; i++) {
        promesas.push(fetch(`${API_URL}${i}`).then(res => {
          if (!res.ok) throw new Error(`Error cargando Pokémon #${i}`);
          return res.json();
        }));
      }
      resultados = await Promise.all(promesas);
    }
    pokemonCache = resultados;

    if (loadingSpinner) loadingSpinner.style.display = "none";
    renderizarPokemon(pokemonCache);
  } catch (error) {
    console.error("Error al obtener datos de PokéAPI:", error);
    if (loadingSpinner) {
      loadingSpinner.innerHTML = `
        <div style="color: var(--accent); font-size: 2.5rem;">⚠️</div>
        <p class="loading-text">No se pudo cargar la Pokédex. Por favor revisa tu conexión a internet.</p>
      `;
    }
  }
}

/* --------------------------------------------------------------------------
   2b. "VIDA" EN LAS TARJETAS: reposo 3D, loop animado al apuntar, inclinación
   Los loops son WebP pre-renderizados (GitHub Actions): el navegador solo reproduce.
   -------------------------------------------------------------------------- */
const rutaReposo = id => `img/3d/s/${id}.webp`;
const rutaAnimada = id => `img/3d/${id}.webp`;
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
let tarjetaViva = null;

function activarTarjeta(card, conInclinacion) {
  if (tarjetaViva === card) return;
  desactivarTarjeta();
  tarjetaViva = card;
  card.classList.add("is-live");
  if (sinMovimiento.matches) return;
  const img = card.querySelector(".pokemon-imagen img");
  const url = rutaAnimada(card.dataset.id);
  const pre = new Image();               // no cambiar hasta tenerlo descargado: sin parpadeo
  pre.onload = () => { if (tarjetaViva === card) img.src = url; };
  pre.src = url;
}

function desactivarTarjeta() {
  if (!tarjetaViva) return;
  const card = tarjetaViva;
  tarjetaViva = null;
  card.classList.remove("is-live");
  card.style.removeProperty("--rx"); card.style.removeProperty("--ry");
  const img = card.querySelector(".pokemon-imagen img");
  if (img) img.src = rutaReposo(card.dataset.id);
}

function initMovimientoTarjetas() {
  listaPokemon.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const card = e.target.closest(".pokemon");
    if (!card) return desactivarTarjeta();
    activarTarjeta(card);
    if (sinMovimiento.matches) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    card.style.setProperty("--rx", ((0.5 - py) * 9).toFixed(2) + "deg");
    card.style.setProperty("--ry", ((px - 0.5) * 11).toFixed(2) + "deg");
    card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
  });
  listaPokemon.addEventListener("pointerleave", desactivarTarjeta);
  listaPokemon.addEventListener("focusin", e => {
    const card = e.target.closest(".pokemon");
    if (card && card.matches(":focus-visible")) activarTarjeta(card);
  });
  listaPokemon.addEventListener("focusout", desactivarTarjeta);
  listaPokemon.addEventListener("keydown", e => {
    const card = e.target.closest(".pokemon");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); card.click(); }
  });
}

/* --------------------------------------------------------------------------
   3. RENDERIZADO DE TARJETAS COMPACTAS EN EL DOM
   -------------------------------------------------------------------------- */
function renderizarPokemon(pokemons) {
  listaPokemon.innerHTML = "";

  if (pokemons.length === 0) {
    sinResultados.style.display = "block";
    if (contadorTexto) contadorTexto.textContent = "0 Pokémon encontrados";
    return;
  }

  sinResultados.style.display = "none";
  if (contadorTexto) contadorTexto.textContent = `${pokemons.length} Pokémon ${filtroTipoActual === 'ver-todos' ? 'registrados' : 'de tipo ' + filtroTipoActual}`;

  const fragment = document.createDocumentFragment();

  pokemons.forEach(poke => {
    const pokeId = formatearId(poke.id);
    const tipoPrincipal = poke.types[0].type.name;

    const tiposHtml = poke.types.map(t => 
      `<span class="${t.type.name} tipo">${t.type.name}</span>`
    ).join("");

    const sprite = poke.sprites.other["official-artwork"].front_default || poke.sprites.front_default;
    const colorAcento = getComputedStyle(document.documentElement).getPropertyValue(`--type-${tipoPrincipal}`) || "var(--accent)";

    const card = document.createElement("div");
    card.className = "pokemon";
    card.style.setProperty("--card-accent", colorAcento.trim());
    card.style.setProperty("--card-glow", colorAcento.trim() + "55");
    card.setAttribute("data-id", poke.id);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Ver detalles de ${poke.name}`);

    card.innerHTML = `
      <p class="pokemon-id-back">#${pokeId}</p>
      <div class="pokemon-imagen">
        <img src="${rutaReposo(poke.id)}" data-art="${sprite}" alt="${poke.name}" width="150" height="150" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=this.dataset.art">
      </div>
      <div class="pokemon-info">
        <div class="nombre-contenedor">
          <span class="pokemon-id">#${pokeId}</span>
          <h2 class="pokemon-nombre">${poke.name}</h2>
        </div>
        <div class="pokemon-tipos">
          ${tiposHtml}
        </div>
        <div class="pokemon-stats-mini">
          <span class="stat-item">Alt: <strong>${(poke.height / 10).toFixed(1)}m</strong></span>
          <span class="stat-item">Peso: <strong>${(poke.weight / 10).toFixed(1)}kg</strong></span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => abrirModalDetalles(poke));
    fragment.appendChild(card);
  });

  listaPokemon.appendChild(fragment);
}

/* --------------------------------------------------------------------------
   4. FILTRADO Y BÚSQUEDA REACTIVA (0 MS)
   -------------------------------------------------------------------------- */
function aplicarFiltros() {
  const query = terminoBusqueda.toLowerCase().trim();

  const filtrados = pokemonCache.filter(poke => {
    const coincideNombre = poke.name.toLowerCase().includes(query);
    const coincideId = poke.id.toString().includes(query) || formatearId(poke.id).includes(query);
    const coincideBusqueda = query === "" || coincideNombre || coincideId;

    const coincideTipo = filtroTipoActual === "ver-todos" || 
      poke.types.some(t => t.type.name === filtroTipoActual);

    return coincideBusqueda && coincideTipo;
  });

  renderizarPokemon(filtrados);
}

/* --------------------------------------------------------------------------
   5. MODAL INTERACTIVO DE ESTADÍSTICAS
   -------------------------------------------------------------------------- */
function abrirModalDetalles(poke) {
  const pokeId = formatearId(poke.id);
  const tipoPrincipal = poke.types[0].type.name;
  const spriteNormal = poke.sprites.other["official-artwork"].front_default || poke.sprites.front_default;
  const spriteShiny = poke.sprites.other["official-artwork"].front_shiny || poke.sprites.front_shiny;

  const tiposHtml = poke.types.map(t => 
    `<span class="${t.type.name} tipo" style="padding: 0.35rem 1rem;">${t.type.name}</span>`
  ).join("");

  const habilidades = poke.abilities.map(a => a.ability.name.replace("-", " ")).join(", ");

  // Nombres y colores de stats
  const statConfig = {
    hp: { label: "HP", max: 255, color: "#10b981" },
    attack: { label: "Ataque", max: 190, color: "#ef4444" },
    defense: { label: "Defensa", max: 230, color: "#3b82f6" },
    "special-attack": { label: "Atq. Esp.", max: 194, color: "#a855f7" },
    "special-defense": { label: "Def. Esp.", max: 230, color: "#06b6d4" },
    speed: { label: "Velocidad", max: 180, color: "#f59e0b" }
  };

  const statsHtml = poke.stats.map(s => {
    const config = statConfig[s.stat.name] || { label: s.stat.name, max: 200, color: "#ef4444" };
    const pct = Math.min(100, Math.round((s.base_stat / config.max) * 100));
    return `
      <div class="stat-row">
        <span class="stat-name">${config.label}</span>
        <span class="stat-number">${s.base_stat}</span>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill" style="width: ${pct}%; background: ${config.color};"></div>
        </div>
      </div>
    `;
  }).join("");

  modalDetalle.innerHTML = `
    <div class="modal-header-info">
      <div class="modal-title-group">
        <span class="pokemon-id" style="font-size: 1.1rem;">#${pokeId}</span>
        <h2>${poke.name}</h2>
      </div>
      <div class="pokemon-tipos">
        ${tiposHtml}
      </div>
    </div>

    <div class="modal-img-wrapper">
      <img id="modal-pokemon-img" class="modal-img" src="${rutaAnimada(poke.id)}" alt="${poke.name}" onerror="this.onerror=null;this.src='${spriteNormal}'">
      ${spriteShiny ? `
        <button id="btn-toggle-shiny" class="shiny-switch-btn">
          <span>✨</span> Ver Versión Shiny
        </button>
      ` : ""}
    </div>

    <div class="pokemon-stats-mini" style="margin-bottom: 1.5rem;">
      <span class="stat-item">Altura: <strong>${(poke.height / 10).toFixed(1)} m</strong></span>
      <span class="stat-item">Peso: <strong>${(poke.weight / 10).toFixed(1)} kg</strong></span>
      <span class="stat-item">Exp. Base: <strong>${poke.base_experience || "N/A"}</strong></span>
    </div>

    <div style="margin-bottom: 1.25rem; font-size: 0.9rem;">
      <strong style="color: var(--text-primary);">Habilidades:</strong> 
      <span style="color: var(--text-secondary); text-transform: capitalize;">${habilidades}</span>
    </div>

    <div class="stats-container">
      <h4 style="margin-bottom: 0.85rem; font-size: 1rem; color: var(--text-primary);">Estadísticas de Combate</h4>
      ${statsHtml}
    </div>
  `;

  // Toggle de sprite normal / shiny
  const btnShiny = document.getElementById("btn-toggle-shiny");
  if (btnShiny && spriteShiny) {
    let esShiny = false;
    btnShiny.addEventListener("click", () => {
      esShiny = !esShiny;
      const img = document.getElementById("modal-pokemon-img");
      img.onerror = null;
      img.src = esShiny ? spriteShiny : rutaAnimada(poke.id);
      btnShiny.classList.toggle("active", esShiny);
      btnShiny.innerHTML = esShiny ? "<span>⭐</span> Versión Shiny Activa" : "<span>✨</span> Ver Versión Shiny";
    });
  }

  modalOverlay.classList.add("active");
  modalOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  modalOverlay.classList.remove("active");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* --------------------------------------------------------------------------
   6. ESCUCHADORES DE EVENTOS
   -------------------------------------------------------------------------- */
function initEventListeners() {
  // Botones de la Portada Hero
  const btnHeroExplorar = document.getElementById("btn-hero-explorar");
  const btnHeroRandom = document.getElementById("btn-hero-random");

  if (btnHeroExplorar) {
    btnHeroExplorar.addEventListener("click", (e) => {
      e.preventDefault();
      const gallery = document.getElementById("pokedex-gallery");
      if (gallery) {
        gallery.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => inputBuscar && inputBuscar.focus(), 600);
      }
    });
  }

  if (btnHeroRandom) {
    btnHeroRandom.addEventListener("click", () => {
      if (pokemonCache.length === 0) return;
      const indiceAleatorio = Math.floor(Math.random() * pokemonCache.length);
      const pokeRandom = pokemonCache[indiceAleatorio];
      abrirModalDetalles(pokeRandom);
    });
  }

  // Búsqueda en vivo
  inputBuscar.addEventListener("input", (e) => {
    terminoBusqueda = e.target.value;
    btnLimpiar.style.display = terminoBusqueda.length > 0 ? "block" : "none";
    aplicarFiltros();
  });

  btnLimpiar.addEventListener("click", () => {
    inputBuscar.value = "";
    terminoBusqueda = "";
    btnLimpiar.style.display = "none";
    inputBuscar.focus();
    aplicarFiltros();
  });

  // Filtros por Tipo
  botonesHeader.forEach(boton => {
    boton.addEventListener("click", (e) => {
      botonesHeader.forEach(b => b.classList.remove("active"));
      const btn = e.currentTarget;
      btn.classList.add("active");
      filtroTipoActual = btn.id;
      aplicarFiltros();
    });
  });

  // Cerrar Modal
  modalBtnCerrar.addEventListener("click", cerrarModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) cerrarModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      cerrarModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. GESTIÓN DE TEMA (MODO CLARO / OSCURO)
   -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem("pokedex_theme") || 
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const nextTheme = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("pokedex_theme", nextTheme);
    });
  }
}

function formatearId(id) {
  return id.toString().padStart(3, "0");
}


/* --------------------------------------------------------------------------
   HERO VIVO: los starters + Pikachu respirando sobre el resplandor, con paralaje
   -------------------------------------------------------------------------- */
function initHeroVivo() {
  const stage = document.querySelector(".hero-stage");
  if (!stage) return;
  const mons = [...stage.querySelectorAll(".hero-mon")];
  const con = navigator.connection || {};
  const conexionLenta = con.saveData || /(^|-)2g|3g/.test(con.effectiveType || "");
  if (!sinMovimiento.matches) {
    // Los loops (~2 MB) se piden DESPUÉS de que la página esté lista y el navegador libre,
    // el reposo ya es visible; en conexión lenta o ahorro de datos no se descargan.
    const cargarLoops = () => {
      if (conexionLenta) return;
      mons.forEach(img => {
        const pre = new Image();
        pre.onload = () => { img.src = img.dataset.anim; };
        pre.src = img.dataset.anim;
      });
    };
    const alCargar = () => ("requestIdleCallback" in window)
      ? requestIdleCallback(cargarLoops, { timeout: 2500 }) : setTimeout(cargarLoops, 1200);
    if (document.readyState === "complete") alCargar(); else window.addEventListener("load", alCargar, { once: true });
    stage.addEventListener("pointermove", e => {
      if (e.pointerType === "touch") return;
      const r = stage.getBoundingClientRect();
      stage.style.setProperty("--px", (((e.clientX - r.left) / r.width) - 0.5).toFixed(3));
      stage.style.setProperty("--py", (((e.clientY - r.top) / r.height) - 0.5).toFixed(3));
    });
    stage.addEventListener("pointerleave", () => {
      stage.style.setProperty("--px", 0); stage.style.setProperty("--py", 0);
    });
  }
}
