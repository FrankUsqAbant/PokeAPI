// Genera data/pokedex.json (151 Pokémon, forma reducida de PokéAPI) para que la web no haga 151 peticiones en cada visita.
// Uso: node scripts/build_data.mjs
import fs from 'node:fs';

const TOTAL = 151;
const get = async (i) => {
  for (let t = 0; t < 3; t++) {
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    if (r.ok) return r.json();
    await new Promise(r => setTimeout(r, 500 * (t + 1)));
  }
  throw new Error(`No se pudo leer #${i}`);
};

const out = [];
for (let i = 1; i <= TOTAL; i += 10) {
  const lote = await Promise.all(Array.from({ length: Math.min(10, TOTAL - i + 1) }, (_, k) => get(i + k)));
  for (const p of lote) {
    const art = p.sprites.other['official-artwork'];
    out.push({
      id: p.id, name: p.name, height: p.height, weight: p.weight, base_experience: p.base_experience,
      types: p.types.map(t => ({ type: { name: t.type.name } })),
      abilities: p.abilities.map(a => ({ ability: { name: a.ability.name } })),
      stats: p.stats.map(s => ({ base_stat: s.base_stat, stat: { name: s.stat.name } })),
      sprites: {
        front_default: p.sprites.front_default, front_shiny: p.sprites.front_shiny,
        other: { 'official-artwork': { front_default: art.front_default, front_shiny: art.front_shiny } },
      },
    });
  }
}
out.sort((a, b) => a.id - b.id);
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/pokedex.json', JSON.stringify(out));
console.log(`OK ${out.length} Pokémon, ${(fs.statSync('data/pokedex.json').size / 1024).toFixed(0)} KB`);
