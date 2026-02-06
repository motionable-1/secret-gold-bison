import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { ShapeAnimation } from "../../library/components/effects/ShapeAnimation";

/**
 * Scene 1: Geometric Shape Burst
 * A single point expands into a kaleidoscope of geometric shapes.
 */

const COLORS = {
  navy: "#2B2D42",
  blue: "#0496FF",
  gold: "#FFBC42",
  pink: "#D81159",
  berry: "#8F2D56",
  white: "#EDF2F4",
};

interface FloatingShapeProps {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  rotation: number;
  shape: "circle" | "triangle" | "diamond" | "hexagon" | "square";
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  x,
  y,
  size,
  color,
  delay,
  rotation,
  shape,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 12, stiffness: 150 },
  });

  const scale = interpolate(entrance, [0, 1], [0, 1]);
  const rotate = interpolate(frame - delay, [0, 120], [0, rotation], {
    extrapolateRight: "extend",
  });
  const float = Math.sin((frame - delay) * 0.05) * 6;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: "center center",
        opacity: interpolate(entrance, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        }),
      }}
    >
      <ShapeAnimation
        shape={shape}
        animation="breathe"
        size={size}
        color={color}
        speed={0.3}
      />
    </div>
  );
};

export const GeoBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Central dot entrance
  const dotScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  // Burst expansion at frame 15
  const burstProgress = spring({
    frame,
    fps,
    delay: 12,
    config: { damping: 15, stiffness: 100 },
  });

  // Background color transition
  const bgOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Pulsing ring around center
  const ringScale = interpolate(frame, [0, 90], [0.8, 1.2], {
    extrapolateRight: "extend",
  });
  const ringPulse = 1 + Math.sin(frame * 0.08) * 0.1;

  // Shapes data
  const shapes: FloatingShapeProps[] = [
    {
      x: width * 0.15,
      y: height * 0.2,
      size: 80,
      color: COLORS.blue,
      delay: 15,
      rotation: 180,
      shape: "triangle",
    },
    {
      x: width * 0.75,
      y: height * 0.15,
      size: 60,
      color: COLORS.gold,
      delay: 18,
      rotation: -120,
      shape: "hexagon",
    },
    {
      x: width * 0.85,
      y: height * 0.6,
      size: 70,
      color: COLORS.pink,
      delay: 21,
      rotation: 90,
      shape: "diamond",
    },
    {
      x: width * 0.1,
      y: height * 0.7,
      size: 55,
      color: COLORS.blue,
      delay: 24,
      rotation: -200,
      shape: "circle",
    },
    {
      x: width * 0.5,
      y: height * 0.1,
      size: 50,
      color: COLORS.berry,
      delay: 20,
      rotation: 150,
      shape: "square",
    },
    {
      x: width * 0.65,
      y: height * 0.8,
      size: 65,
      color: COLORS.gold,
      delay: 27,
      rotation: -90,
      shape: "triangle",
    },
    {
      x: width * 0.3,
      y: height * 0.85,
      size: 45,
      color: COLORS.pink,
      delay: 22,
      rotation: 270,
      shape: "hexagon",
    },
    {
      x: width * 0.9,
      y: height * 0.35,
      size: 40,
      color: COLORS.berry,
      delay: 25,
      rotation: -150,
      shape: "diamond",
    },
    {
      x: width * 0.35,
      y: height * 0.45,
      size: 35,
      color: COLORS.blue,
      delay: 30,
      rotation: 60,
      shape: "circle",
    },
    {
      x: width * 0.6,
      y: height * 0.5,
      size: 45,
      color: COLORS.gold,
      delay: 28,
      rotation: -45,
      shape: "square",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.navy} 0%, #151729 100%)`,
      }}
    >
      {/* Ambient gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 30% 40%, ${COLORS.blue}15 0%, transparent 50%), radial-gradient(circle at 70% 60%, ${COLORS.pink}12 0%, transparent 50%)`,
          opacity: bgOpacity,
        }}
      />

      {/* Grid lines (subtle, architectural) */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(frame, [20, 40], [0, 0.08], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <React.Fragment key={i}>
            <line
              x1={width * ((i + 1) / 13)}
              y1={0}
              x2={width * ((i + 1) / 13)}
              y2={height}
              stroke={COLORS.white}
              strokeWidth={0.5}
            />
            <line
              x1={0}
              y1={height * ((i + 1) / 13)}
              x2={width}
              y2={height * ((i + 1) / 13)}
              stroke={COLORS.white}
              strokeWidth={0.5}
            />
          </React.Fragment>
        ))}
      </svg>

      {/* Central pulsing ring */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - 100,
          top: height / 2 - 100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: `2px solid ${COLORS.blue}40`,
          transform: `scale(${ringScale * ringPulse * burstProgress})`,
          opacity: burstProgress * 0.5,
        }}
      />

      {/* Central dot */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - 8,
          top: height / 2 - 8,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: COLORS.white,
          transform: `scale(${dotScale})`,
          boxShadow: `0 0 30px ${COLORS.blue}80, 0 0 60px ${COLORS.blue}40`,
        }}
      />

      {/* Burst shapes */}
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}

      {/* Decorative lines radiating from center */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(burstProgress, [0, 1], [0, 0.25]),
        }}
      >
        {[0, 45, 90, 135].map((angle) => {
          const len = interpolate(burstProgress, [0, 1], [0, 350]);
          const rad = (angle * Math.PI) / 180;
          const x2 = width / 2 + Math.cos(rad) * len;
          const y2 = height / 2 + Math.sin(rad) * len;
          return (
            <line
              key={angle}
              x1={width / 2}
              y1={height / 2}
              x2={x2}
              y2={y2}
              stroke={COLORS.white}
              strokeWidth={1}
              strokeDasharray="4 8"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
