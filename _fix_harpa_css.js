const fs = require('fs');
let css = fs.readFileSync('assets/css/tema.css', 'utf8');

// Encontrar e substituir o bloco "/* Player bar */" até antes de "/* Secao de letra"
const startMark = '/* Player bar */';
const endMark   = '/* Seção de letra (Coro / Estrofe) */';

const startIdx = css.indexOf(startMark);
const endIdx   = css.indexOf(endMark);

if (startIdx === -1 || endIdx === -1) {
  // Tentar variação sem acento
  const alt = css.indexOf('/* Secao de letra');
  console.error('Marcadores. start=' + startIdx + ' end=' + endIdx + ' alt=' + alt);
  // mostrar trecho para debug
  const probe = css.indexOf('.harpa-secao {');
  console.log(css.slice(probe - 100, probe + 10));
  process.exit(1);
}

const before = css.slice(0, startIdx);
const after  = css.slice(endIdx);

const newBlock = `/* === Harpa Crista - Player de audio Deezer + YouTube === */
.harpa-player-painel {
  background: var(--cor-fundo-card);
  border: 1.5px solid var(--cor-borda);
  border-radius: 16px;
  padding: 14px 16px 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hap-carregando {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--cor-texto-secundario);
  font-size: 0.88rem;
  justify-content: center;
  padding: 8px 0;
}
@keyframes harpaVinylSpin { to { transform: rotate(360deg); } }
.hap-spin-vinyl {
  font-size: 1.4rem;
  color: var(--cor-primaria);
  animation: harpaVinylSpin 1.2s linear infinite;
}
.hap-player { display: flex; flex-direction: column; gap: 6px; }
.hap-cabecalho { display: flex; align-items: center; gap: 10px; }
.hap-ico-nota { font-size: 1.3rem; color: var(--cor-primaria); flex-shrink: 0; }
.hap-info { display: flex; flex-direction: column; min-width: 0; }
.hap-titulo {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--cor-texto);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hap-badge { font-size: 0.7rem; color: var(--cor-texto-secundario); margin-top: 1px; }
.hap-barra-wrap { cursor: pointer; padding: 6px 0; }
.hap-barra-bg {
  height: 5px;
  border-radius: 99px;
  background: var(--cor-borda);
  position: relative;
  overflow: hidden;
}
.hap-barra-fill {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  border-radius: 99px;
  background: var(--cor-primaria);
  transition: width 0.3s linear;
}
.hap-controles { display: flex; align-items: center; gap: 8px; }
.hap-tempo {
  font-size: 0.72rem;
  color: var(--cor-texto-secundario);
  font-variant-numeric: tabular-nums;
  min-width: 32px;
}
.hap-tempo-fim { text-align: right; }
.hap-btns { flex: 1; display: flex; justify-content: center; }
.hap-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px; height: 42px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}
.hap-btn-pp { background: var(--cor-primaria); color: #fff; font-size: 1.2rem; }
.hap-btn-pp:hover { transform: scale(1.08); }
.hap-nao-encontrado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 0;
  color: var(--cor-texto-secundario);
  font-size: 0.82rem;
  text-align: center;
}
.hap-nao-encontrado i { font-size: 1.6rem; color: var(--cor-borda); }
.hap-nao-encontrado p { margin: 0; line-height: 1.5; }
.hap-rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--cor-borda);
  padding-top: 10px;
  gap: 8px;
}
.hap-link-yt {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #cc0000;
  text-decoration: none;
  transition: opacity 0.15s;
}
.hap-link-yt:hover { opacity: 0.78; text-decoration: underline; }
.hap-btn-fechar {
  background: none;
  border: none;
  color: var(--cor-texto-secundario);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: color 0.15s;
}
.hap-btn-fechar:hover { color: var(--cor-texto); }

`;

const result = before + newBlock + after;
fs.writeFileSync('assets/css/tema.css', result, 'utf8');
console.log('CSS atualizado! Tamanho final:', result.length);
