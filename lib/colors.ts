// Deterministic color by id (so each user keeps the same color)
export function colorFromId(id: string) {
  const palette = [
    "#22d3ee", "#34d399", "#f59e0b", "#f472b6", "#60a5fa",
    "#f87171", "#a78bfa", "#4ade80", "#fb923c", "#2dd4bf"
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}
