/**
 * HUD - helpers para tempo restante de efeitos
 */
export function formatarTempoRestante(terminaEm) {
  if (!terminaEm) return '';
  const fim = new Date(terminaEm);
  const agora = new Date();
  const min = Math.max(0, Math.round((fim - agora) / 60000));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}
