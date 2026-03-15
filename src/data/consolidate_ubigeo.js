const https = require('https');
const fs = require('fs');
const path = require('path');

const fetch = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => resolve(JSON.parse(data)));
  }).on('error', reject);
});

async function main() {
  console.log('Fetching departments...');
  const dptos = await fetch('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/departamentos.json');
  console.log('Fetching provinces...');
  const provs = await fetch('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/provincias.json');
  console.log('Fetching districts...');
  const dists = await fetch('https://raw.githubusercontent.com/joseluisq/ubigeos-peru/master/json/distritos.json');

  console.log('Consolidating data...');
  const consolidated = dptos.map(d => {
    const d_provs = provs[d.id_ubigeo] || [];
    return {
      name: d.nombre_ubigeo,
      provincias: d_provs.map(p => {
        const p_dists = dists[p.id_ubigeo] || [];
        return {
          name: p.nombre_ubigeo,
          distritos: p_dists.map(di => di.nombre_ubigeo)
        };
      })
    };
  });

  const outputPath = path.join(__dirname, 'ubigeo.json');
  fs.writeFileSync(outputPath, JSON.stringify(consolidated, null, 2));
  console.log(`Consolidated ubigeo.json created successfully at ${outputPath}`);
}

main().catch(console.error);
