export const US_LNG_WEST = -125;
export const US_LNG_EAST = -66;
export const US_LAT_SOUTH = 24.5;
export const US_LAT_NORTH = 49.5;

export interface MapViewBox {
  width: number;
  height: number;
  pad: number;
}

export const mapViewBox: MapViewBox = { width: 960, height: 580, pad: 28 };

export function projectLngLat(
  lng: number,
  lat: number,
  box: MapViewBox = mapViewBox,
): { x: number; y: number } {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    throw new Error(`Missing lat/lng (${lat}, ${lng})`);
  }
  const innerW = box.width - box.pad * 2;
  const innerH = box.height - box.pad * 2;
  return {
    x: box.pad + ((lng - US_LNG_WEST) / (US_LNG_EAST - US_LNG_WEST)) * innerW,
    y: box.pad + ((US_LAT_NORTH - lat) / (US_LAT_NORTH - US_LAT_SOUTH)) * innerH,
  };
}

export function ringToPath(ring: readonly (readonly [number, number])[], box: MapViewBox = mapViewBox): string {
  const parts = ring.map(([lng, lat], i) => {
    const { x, y } = projectLngLat(lng, lat, box);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return `${parts.join(" ")} Z`;
}
