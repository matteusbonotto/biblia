const fs = require('fs');
let css = fs.readFileSync('assets/css/tema.css', 'utf8');

// Usar regex para encontrar o fim do bloco .harpa-secao-label
const re = /(\.harpa-secao-label\s*\{[\s\S]*?margin-bottom:\s*6px;\s*\})/;
const m = re.exec(css);
if (!m) { console.error('Regex nao casou'); process.exit(1); }

console.log('Encontrado em:', m.index, '+ len:', m[0].length);

const insertAt = m.index + m[0].length;
const toAppend = `

/* Letras com quebra de linha real (\\n => quebra visivel) */
.harpa-secao .verso-texto {
  white-space: pre-line;
  line-height: 1.7;
}

/* Coro -- visualmente diferente da estrofe */
.harpa-secao--coro {
  border-radius: 0 10px 10px 0;
  padding: 10px 12px;
}
.harpa-secao-label--coro {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
`;

const result = css.slice(0, insertAt) + toAppend + css.slice(insertAt);
fs.writeFileSync('assets/css/tema.css', result, 'utf8');
console.log('Concluido! Tamanho:', result.length);
