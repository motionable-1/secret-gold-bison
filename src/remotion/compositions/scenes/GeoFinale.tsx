import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { TextAnimation } from "../../library/components/text/TextAnimation";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { ShapeAnimation } from "../../library/components/effects/ShapeAnimation";

/**
 * Scene 5: Geometric Finale
 * All elements converge into a final composition - order from chaos.
 */

const COLORS = {
  navy: "#2B2D42",
  blue: "#0496FF",
  gold: "#FFBC42",
  pink: "#D81159",
  berry: "#8F2D56",
  white: "#EDF2F4",
};

interface ConstellationNodeProps {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

const ConstellationNode: React.FC<ConstellationNodeProps> = ({
  x,
  y,
  size,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay,
    config: { damping: 10, stiffness: 180 },
  });

  const pulse = 1 + Math.sin((frame - delay) * 0.06) * 0.15;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        transform: `scale(${enter * pulse})`,
        opacity: enter,
        boxShadow: `0 0 ${size * 2}px ${color}50`,
      }}
    />
  );
};

interface ConstellationLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

const ConstellationLine: React.FC<ConstellationLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const drawProgress = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  if (drawProgress <= 0) return null;

  const cx = x1 + (x2 - x1) * drawProgress;
  const cy = y1 + (y2 - y1) * drawProgress;

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={cx}
        y2={cy}
        stroke={`${COLORS.white}30`}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const GeoFinale: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { fontFamily } = loadSpaceGrotesk();

  // Central emblem convergence
  const converge = spring({
    frame,
    fps,
    delay: 5,
    config: { damping: 12, stiffness: 100 },
  });

  // Final text
  const textEnter = spring({
    frame,
    fps,
    delay: 25,
    config: { damping: 18, stiffness: 120 },
  });

  const taglineEnter = spring({
    frame,
    fps,
    delay: 40,
    config: { damping: 20, stiffness: 100 },
  });

  // Background rotation
  const bgRotation = interpolate(frame, [0, 300], [0, 15], {
    extrapolateRight: "extend",
  });

  // Constellation nodes
  const nodes = [
    {
      x: width * 0.2,
      y: height * 0.25,
      size: 14,
      color: COLORS.blue,
      delay: 0,
    },
    {
      x: width * 0.35,
      y: height * 0.15,
      size: 10,
      color: COLORS.gold,
      delay: 3,
    },
    {
      x: width * 0.65,
      y: height * 0.2,
      size: 12,
      color: COLORS.pink,
      delay: 6,
    },
    { x: width * 0.8, y: height * 0.3, size: 8, color: COLORS.blue, delay: 9 },
    {
      x: width * 0.15,
      y: height * 0.6,
      size: 10,
      color: COLORS.gold,
      delay: 4,
    },
    {
      x: width * 0.85,
      y: height * 0.65,
      size: 12,
      color: COLORS.pink,
      delay: 7,
    },
    {
      x: width * 0.25,
      y: height * 0.8,
      size: 8,
      color: COLORS.berry,
      delay: 10,
    },
    {
      x: width * 0.7,
      y: height * 0.85,
      size: 14,
      color: COLORS.blue,
      delay: 2,
    },
    { x: width * 0.5, y: height * 0.9, size: 10, color: COLORS.gold, delay: 8 },
  ];

  // Lines connecting nodes
  const lines = [
    { from: 0, to: 1, delay: 12 },
    { from: 1, to: 2, delay: 15 },
    { from: 2, to: 3, delay: 18 },
    { from: 0, to: 4, delay: 14 },
    { from: 3, to: 5, delay: 20 },
    { from: 4, to: 6, delay: 17 },
    { from: 5, to: 7, delay: 22 },
    { from: 6, to: 8, delay: 19 },
    { from: 7, to: 8, delay: 24 },
  ];

  // Fade out at end
  const fadeOut = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + bgRotation}deg, ${COLORS.navy} 0%, #0f1024 50%, ${COLORS.navy} 100%)`,
        opacity: fadeOut,
      }}
    >
      {/* Radial glow behind center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${COLORS.blue}15 0%, transparent 50%)`,
        }}
      />

      {/* Constellation lines */}
      {lines.map((line, i) => (
        <ConstellationLine
          key={i}
          x1={nodes[line.from].x}
          y1={nodes[line.from].y}
          x2={nodes[line.to].x}
          y2={nodes[line.to].y}
          delay={line.delay}
        />
      ))}

      {/* Constellation nodes */}
      {nodes.map((node, i) => (
        <ConstellationNode key={i} {...node} />
      ))}

      {/* Central convergence emblem */}
      <div
        style={{
          position: "absolute",
          left: width / 2,
          top: height / 2 - 20,
          transform: `translate(-50%, -50%) scale(${converge}) rotate(${frame * 0.3}deg)`,
        }}
      >
        <ShapeAnimation
          shape="hexagon"
          animation="breathe"
          size={100}
          color={COLORS.blue}
          strokeWidth={3}
          strokeColor={COLORS.blue}
          speed={0.3}
        />
      </div>

      {/* Inner ring */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - 35,
          top: height / 2 - 55,
          transform: `scale(${converge}) rotate(${-frame * 0.2}deg)`,
          transformOrigin: "center center",
        }}
      >
        <ShapeAnimation
          shape="triangle"
          animation="breathe"
          size={70}
          color={COLORS.gold}
          strokeWidth={2}
          strokeColor={COLORS.gold}
          speed={0.4}
        />
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: width * 0.5 - 350,
          top: height * 0.62,
          width: 700,
          textAlign: "center",
          transform: `translateY(${interpolate(textEnter, [0, 1], [25, 0])}px)`,
          opacity: textEnter,
        }}
      >
        <TextAnimation
          className="font-bold text-center"
          style={{
            fontFamily,
            fontSize: 56,
            color: COLORS.white,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.fromTo(
              split.words,
              { opacity: 0, y: 30, scale: 0.9 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.08,
                ease: "back.out(1.4)",
              },
            );
            return tl;
          }}
          startFrom={25}
        >
          MOTION IS EVERYTHING
        </TextAnimation>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          left: width * 0.5 - 180,
          top: height * 0.75,
          width: 360,
          textAlign: "center",
          transform: `translateY(${interpolate(taglineEnter, [0, 1], [15, 0])}px)`,
          opacity: taglineEnter,
        }}
      >
        <TextAnimation
          style={{
            fontFamily,
            fontSize: 16,
            color: `${COLORS.white}80`,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.fromTo(
              split.chars,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.3,
                stagger: 0.015,
                ease: "none",
              },
            );
            return tl;
          }}
          startFrom={40}
        >
          geometric kinetic design
        </TextAnimation>
      </div>
    </AbsoluteFill>
  );
};
