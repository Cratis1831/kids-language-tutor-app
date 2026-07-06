export interface MapNode {
  /** Horizontal position as a percentage (0–100) of the container width. */
  x: number;
  /** Vertical position in pixels from the top of the container. */
  y: number;
}

export interface MapLayout {
  nodes: MapNode[];
  /** Total container height in pixels. */
  height: number;
  /** SVG path in the coordinate space x:[0,100], y:[0,height]. */
  pathD: string;
}

const ROW_HEIGHT = 132;
const TOP_PAD = 90;
const BOTTOM_PAD = 90;
const AMPLITUDE = 28; // how far the path swings left/right of centre

/**
 * Compute a serpentine (Candyland-style) path threading through `count` level
 * nodes. Nodes are placed on a gentle sine wave; the connecting path uses
 * vertical-tangent cubic curves so it reads as a smooth winding road.
 */
export function buildMapLayout(count: number): MapLayout {
  const height = TOP_PAD + BOTTOM_PAD + Math.max(0, count - 1) * ROW_HEIGHT;
  const nodes: MapNode[] = Array.from({ length: count }, (_, i) => ({
    x: 50 + AMPLITUDE * Math.sin(i * 0.9 + 0.4),
    y: TOP_PAD + i * ROW_HEIGHT,
  }));

  let pathD = '';
  nodes.forEach((node, i) => {
    if (i === 0) {
      pathD = `M ${node.x} ${node.y}`;
      return;
    }
    const prev = nodes[i - 1];
    const midDy = ROW_HEIGHT / 2;
    pathD += ` C ${prev.x} ${prev.y + midDy}, ${node.x} ${node.y - midDy}, ${node.x} ${node.y}`;
  });

  return { nodes, height, pathD };
}
