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

/**
 * Scene 3: Liquid Morph
 * Sharp shapes dissolve into organic forms with fluid motion.
 */

const COLORS = {
  navy: "#2B2D42",
  blue: "#0496FF",
  gold: "#FFBC42",
  pink: "#D81159",
  berry: "#8F2D56",
  white: "#EDF2F4",
};

interface BlobProps {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  delay: number;
  phase: number;
}

const MorphBlob: React.FC<BlobProps> = ({
  x,
  y,
  size,
  color,
  speed,
  delay,
  phase,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 15, stiffness: 80 },
  });

  const t = (frame - delay) * speed * 0.03;

  // Organic blob border radius (morphing)
  const r1 = 30 + 20 * Math.sin(t + phase);
  const r2 = 30 + 20 * Math.sin(t + phase + Math.PI * 0.5);
  const r3 = 30 + 20 * Math.sin(t + phase + Math.PI);
  const r4 = 30 + 20 * Math.sin(t + phase + Math.PI * 1.5);

  const float = Math.sin(t * 0.8 + phase) * 15;
  const breathe = 1 + Math.sin(t * 0.6) * 0.08;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: `${r1}% ${100 - r1}% ${r2}% ${100 - r2}% / ${r3}% ${r4}% ${100 - r4}% ${100 - r3}%`,
        transform: `scale(${entrance * breathe})`,
        opacity: entrance * 0.85,
        boxShadow: `0 20px 60px ${color}30`,
      }}
    />
  );
};

export const LiquidMorph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { fontFamily } = loadSpaceGrotesk();

  // Text entrance
  const textEnter = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 20, stiffness: 100 },
  });

  // Subtitle entrance
  const subEnter = spring({
    frame,
    fps,
    delay: 30,
    config: { damping: 18, stiffness: 120 },
  });

  // Background gradient rotation
  const gradientAngle = interpolate(frame, [0, 180], [135, 225], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${COLORS.navy} 0%, #1a1d35 40%, ${COLORS.berry}40 100%)`,
      }}
    >
      {/* Ambient gradient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 60% 40%, ${COLORS.pink}20 0%, transparent 60%)`,
        }}
      />

      {/* Morphing blobs */}
      <MorphBlob
        x={width * 0.08}
        y={height * 0.15}
        size={200}
        color={COLORS.blue}
        speed={1}
        delay={0}
        phase={0}
      />
      <MorphBlob
        x={width * 0.65}
        y={height * 0.55}
        size={160}
        color={COLORS.pink}
        speed={0.8}
        delay={5}
        phase={2}
      />
      <MorphBlob
        x={width * 0.4}
        y={height * 0.7}
        size={120}
        color={COLORS.gold}
        speed={1.2}
        delay={8}
        phase={4}
      />
      <MorphBlob
        x={width * 0.78}
        y={height * 0.1}
        size={100}
        color={COLORS.berry}
        speed={0.6}
        delay={12}
        phase={1}
      />
      <MorphBlob
        x={width * 0.25}
        y={height * 0.45}
        size={80}
        color={`${COLORS.blue}80`}
        speed={1.5}
        delay={10}
        phase={3}
      />

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          left: width * 0.5 - 300,
          top: height * 0.35,
          width: 600,
          textAlign: "center",
          transform: `translateY(${interpolate(textEnter, [0, 1], [30, 0])}px)`,
          opacity: textEnter,
        }}
      >
        <TextAnimation
          className="font-bold text-center"
          style={{
            fontFamily,
            fontSize: 80,
            color: COLORS.white,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            textShadow: `0 4px 30px ${COLORS.navy}80`,
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.fromTo(
              split.chars,
              {
                opacity: 0,
                scale: 0.6,
                filter: "blur(8px)",
              },
              {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.7,
                stagger: 0.03,
                ease: "power3.out",
              }
            );
            return tl;
          }}
          startFrom={15}
        >
          DISSOLVE
        </TextAnimation>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          left: width * 0.5 - 200,
          top: height * 0.52,
          width: 400,
          textAlign: "center",
          transform: `translateY(${interpolate(subEnter, [0, 1], [20, 0])}px)`,
          opacity: subEnter,
        }}
      >
        <TextAnimation
          style={{
            fontFamily,
            fontSize: 22,
            color: `${COLORS.white}B0`,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.fromTo(
              split.chars,
              { opacity: 0, y: 15 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.02,
                ease: "power2.out",
              }
            );
            return tl;
          }}
          startFrom={30}
        >
          into something new
        </TextAnimation>
      </div>

      {/* Floating accent dots */}
      {[
        { x: 0.15, y: 0.35, s: 6, d: 20 },
        { x: 0.85, y: 0.42, s: 8, d: 22 },
        { x: 0.55, y: 0.85, s: 5, d: 25 },
        { x: 0.35, y: 0.12, s: 7, d: 18 },
        { x: 0.9, y: 0.8, s: 4, d: 28 },
      ].map((dot, i) => {
        const dotEnter = spring({
          frame,
          fps,
          delay: dot.d,
          config: { damping: 12, stiffness: 200 },
        });
        const floatY = Math.sin(frame * 0.04 + i * 2) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: width * dot.x,
              top: height * dot.y + floatY,
              width: dot.s,
              height: dot.s,
              borderRadius: "50%",
              backgroundColor: COLORS.white,
              transform: `scale(${dotEnter})`,
              opacity: dotEnter * 0.6,
              boxShadow: `0 0 12px ${COLORS.white}40`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
