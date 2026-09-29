export const colors = {
  background: '#071D18', surface: '#153A30', terracotta: '#C77955',
  rain: '#82D5D0', text: '#F3EBDD', muted: '#B8C7BD', growth: '#A9C878',
  soil: '#293C2C', stone: '#617669', leaf: '#527C50', flower: '#E7B899',
} as const;
export const TOKENS = {
  colors,
  spacing: { small: 0.008, medium: 0.016, large: 0.032 },
  motion: { bloomSeconds: 1.8, rainSeconds: 2.4, breathSeconds: 4 },
  material: { roughness: 0.88, waterRoughness: 0.28, metalness: 0.08 },
  typography: { family: 'Inter, system-ui, sans-serif' },
} as const;
