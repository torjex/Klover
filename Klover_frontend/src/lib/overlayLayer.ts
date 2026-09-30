import L from "leaflet";

export interface OverlayBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

/**
 * Ground bounds for a newly added photo: exactly the area the satellite view is
 * showing. Recording the visible extent means that selecting the photo later
 * frames it back to the same rectangle, so it occupies the whole map area at
 * precisely the size the satellite basemap did.
 */
export function initialBox(map: L.Map): OverlayBox {
  const bounds = map.getBounds();
  return {
    south: bounds.getSouth(),
    west: bounds.getWest(),
    north: bounds.getNorth(),
    east: bounds.getEast(),
  };
}
