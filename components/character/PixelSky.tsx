"use client";

const P = 4; // base pixel size in px

type Rect = [number, number, number, number]; // [col, row, w, h]

// --- Cloud shapes (col, row, w, h in pixel units) ---

const CLOUD_XL: Rect[] = [
  [10, 0, 5, 1],
  [20, 0, 6, 1],
  [7, 1, 11, 1],
  [18, 1, 12, 1],
  [4, 2, 28, 1],
  [2, 3, 32, 1],
  [0, 4, 36, 1],
  [0, 5, 36, 1],
  [0, 6, 36, 1],
  [0, 7, 35, 1],
  [1, 8, 33, 1],
  [3, 9, 29, 1],
  [7, 10, 22, 1],
  [12, 11, 14, 1],
];
const SHADOW_XL: Rect[] = [
  [3, 9, 29, 1],
  [7, 10, 22, 1],
  [12, 11, 14, 1],
];

const CLOUD_L: Rect[] = [
  [5, 0, 5, 1],
  [14, 0, 5, 1],
  [3, 1, 9, 1],
  [12, 1, 9, 1],
  [1, 2, 22, 1],
  [0, 3, 24, 1],
  [0, 4, 24, 1],
  [0, 5, 24, 1],
  [0, 6, 23, 1],
  [1, 7, 21, 1],
  [4, 8, 16, 1],
  [8, 9, 9, 1],
];
const SHADOW_L: Rect[] = [
  [1, 7, 21, 1],
  [4, 8, 16, 1],
  [8, 9, 9, 1],
];

const CLOUD_M: Rect[] = [
  [4, 0, 4, 1],
  [10, 0, 4, 1],
  [2, 1, 8, 1],
  [9, 1, 7, 1],
  [0, 2, 17, 1],
  [0, 3, 17, 1],
  [0, 4, 17, 1],
  [0, 5, 16, 1],
  [2, 6, 13, 1],
  [5, 7, 7, 1],
];
const SHADOW_M: Rect[] = [
  [0, 5, 16, 1],
  [2, 6, 13, 1],
  [5, 7, 7, 1],
];

const CLOUD_S: Rect[] = [
  [2, 0, 4, 1],
  [1, 1, 7, 1],
  [0, 2, 9, 1],
  [0, 3, 9, 1],
  [1, 4, 7, 1],
  [3, 5, 4, 1],
];
const SHADOW_S: Rect[] = [
  [1, 4, 7, 1],
  [3, 5, 4, 1],
];

const CLOUD_WISP: Rect[] = [
  [1, 0, 5, 1],
  [0, 1, 8, 1],
  [0, 2, 8, 1],
  [1, 3, 5, 1],
];
const SHADOW_WISP: Rect[] = [[1, 3, 5, 1]];

// --- Dimensions ---

const DIMS = {
  XL: { cols: 36, rows: 12 },
  L: { cols: 24, rows: 10 },
  M: { cols: 17, rows: 8 },
  S: { cols: 9, rows: 6 },
  WISP: { cols: 8, rows: 4 },
};

// --- Rendering ---

function CloudSVG({
  shape,
  shadow,
  dims,
  color,
  shadowColor,
  scale,
  opacity = 1,
}: {
  shape: Rect[];
  shadow: Rect[];
  dims: { cols: number; rows: number };
  color: string;
  shadowColor: string;
  scale: number;
  opacity?: number;
}) {
  const vw = dims.cols * P;
  const vh = dims.rows * P;
  return (
    <svg
      width={vw * scale}
      height={vh * scale}
      viewBox={`0 0 ${vw} ${vh}`}
      style={{ display: "block", flexShrink: 0, opacity }}
    >
      {shape.map(([c, r, w, h], i) => (
        <rect
          key={i}
          x={c * P}
          y={r * P}
          width={w * P}
          height={h * P}
          fill={color}
          shapeRendering="crispEdges"
        />
      ))}
      {shadow.map(([c, r, w, h], i) => (
        <rect
          key={i}
          x={c * P}
          y={r * P}
          width={w * P}
          height={h * P}
          fill={shadowColor}
          shapeRendering="crispEdges"
        />
      ))}
    </svg>
  );
}

interface CloudDef {
  shape: Rect[];
  shadow: Rect[];
  dims: { cols: number; rows: number };
  scale?: number;
  opacity?: number;
}
interface LayerConfig {
  top: string;
  speed: number;
  scale: number;
  color: string;
  shadowColor: string;
  gap: number;
  clouds: CloudDef[];
}

const COLOR = "#EEF0FF";
const SHADOW = "#C4C8E8";

const LAYERS: LayerConfig[] = [
  {
    top: "-3%",
    speed: 190,
    scale: 3.0,
    color: COLOR,
    shadowColor: SHADOW,
    gap: 320,
    clouds: [
      {
        shape: CLOUD_WISP,
        shadow: SHADOW_WISP,
        dims: DIMS.WISP,
        scale: 1.2,
        opacity: 0.7,
      },
      { shape: CLOUD_M, shadow: SHADOW_M, dims: DIMS.M, opacity: 0.9 },
      {
        shape: CLOUD_S,
        shadow: SHADOW_S,
        dims: DIMS.S,
        scale: 4.44,
        opacity: 0.6,
      },
      { shape: CLOUD_L, shadow: SHADOW_L, dims: DIMS.L, opacity: 1.0 },
      {
        shape: CLOUD_WISP,
        shadow: SHADOW_WISP,
        dims: DIMS.WISP,
        scale: 1.2,
        opacity: 0.75,
      },
    ],
  },
  {
    top: "38%",
    speed: 310,
    scale: 3.0,
    color: COLOR,
    shadowColor: SHADOW,
    gap: 400,
    clouds: [
      {
        shape: CLOUD_S,
        shadow: SHADOW_S,
        dims: DIMS.S,
        scale: 4.44,
        opacity: 0.85,
      },
      { shape: CLOUD_L, shadow: SHADOW_L, dims: DIMS.L, opacity: 0.65 },
      {
        shape: CLOUD_WISP,
        shadow: SHADOW_WISP,
        dims: DIMS.WISP,
        scale: 1.4,
        opacity: 0.95,
      },
      { shape: CLOUD_XL, shadow: SHADOW_XL, dims: DIMS.XL, opacity: 0.8 },
      {
        shape: CLOUD_S,
        shadow: SHADOW_S,
        dims: DIMS.S,
        scale: 4.44,
        opacity: 0.7,
      },
    ],
  },
  {
    top: "68%",
    speed: 250,
    scale: 3.0,
    color: COLOR,
    shadowColor: SHADOW,
    gap: 500,
    clouds: [
      { shape: CLOUD_XL, shadow: SHADOW_XL, dims: DIMS.XL, opacity: 0.9 },
      {
        shape: CLOUD_WISP,
        shadow: SHADOW_WISP,
        dims: DIMS.WISP,
        scale: 1.5,
        opacity: 0.6,
      },
      { shape: CLOUD_L, shadow: SHADOW_L, dims: DIMS.L, opacity: 1.0 },
      {
        shape: CLOUD_S,
        shadow: SHADOW_S,
        dims: DIMS.S,
        scale: 4.44,
        opacity: 0.75,
      },
      { shape: CLOUD_XL, shadow: SHADOW_XL, dims: DIMS.XL, opacity: 0.85 },
    ],
  },
  {
    top: "92%",
    speed: 170,
    scale: 3.0,
    color: COLOR,
    shadowColor: SHADOW,
    gap: 600,
    clouds: [
      { shape: CLOUD_L, shadow: SHADOW_L, dims: DIMS.L, opacity: 0.7 },
      {
        shape: CLOUD_S,
        shadow: SHADOW_S,
        dims: DIMS.S,
        scale: 4.44,
        opacity: 0.95,
      },
      { shape: CLOUD_XL, shadow: SHADOW_XL, dims: DIMS.XL, opacity: 0.8 },
      {
        shape: CLOUD_WISP,
        shadow: SHADOW_WISP,
        dims: DIMS.WISP,
        scale: 1.5,
        opacity: 0.65,
      },
      { shape: CLOUD_L, shadow: SHADOW_L, dims: DIMS.L, opacity: 1.0 },
    ],
  },
];

function CloudGroup({ layer }: { layer: LayerConfig }) {
  const { clouds, scale: defaultScale, color, shadowColor, gap } = layer;
  return (
    <div style={{ display: "flex", alignItems: "flex-end" }}>
      {clouds.map((cloud, i) => (
        <div key={i} style={{ marginRight: i < clouds.length - 1 ? gap : 0 }}>
          <CloudSVG
            shape={cloud.shape}
            shadow={cloud.shadow}
            dims={cloud.dims}
            color={color}
            shadowColor={shadowColor}
            scale={cloud.scale ?? defaultScale}
            opacity={cloud.opacity}
          />
        </div>
      ))}
    </div>
  );
}

export default function PixelSky() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#8AA9FB",
        zIndex: -1,
      }}
    >
      {LAYERS.map((layer, li) => (
        <div
          key={li}
          style={{
            position: "absolute",
            top: layer.top,
            left: 0,
            display: "flex",
            willChange: "transform",
            animation: `scroll-clouds ${layer.speed}s linear infinite`,
          }}
        >
          <div style={{ display: "flex", paddingRight: layer.gap }}>
            <CloudGroup layer={layer} />
          </div>
          <div style={{ display: "flex", paddingRight: layer.gap }}>
            <CloudGroup layer={layer} />
          </div>
        </div>
      ))}
    </div>
  );
}
