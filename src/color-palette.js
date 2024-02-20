function generateViridisPalette(steps) {
  const viridisData = [
    [68, 1, 84],
    [71, 44, 122],
    [59, 81, 139],
    [44, 113, 142],
    [33, 144, 141],
    [39, 173, 129],
    [92, 200, 99],
    [170, 220, 50],
    [253, 231, 37]
  ];
  let palette = [];
  for (let i = 0; i < steps; i++) {
    const index = (i / (steps - 1)) * (viridisData.length - 1);
    const startIndex = Math.floor(index);
    const endIndex = Math.ceil(index);
    const t = index - startIndex;
    const startColor = viridisData[startIndex];
    const endColor = viridisData[endIndex] || viridisData[startIndex];
    const r = startColor[0] + (endColor[0] - startColor[0]) * t;
    const g = startColor[1] + (endColor[1] - startColor[1]) * t;
    const b = startColor[2] + (endColor[2] - startColor[2]) * t;
    palette.push(`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);
  }
  return palette;
}
// Usage
const viridisPalette = generateViridisPalette(256); 


export function getColor(value){

    return viridisPalette[value];
}

