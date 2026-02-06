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
 * Scene 2: Kinetic Typography
 * Words move like physical objects on a grid, intersecting with geometric shapes.
 */

const COLORS = {
  navy: "#2B2D42",
  blue: "#0496FF",
  gold: "#FFBC42",
  pink: "#D81159",
  berry: "#8F2D56",
  white: "#EDF2F4",
};

const WORDS = ["FORM", "FLOW", "SHAPE"];

export const KineticType: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { fontFamily } = loadSpaceGrotesk();

  // Staggered word entrances
  const word1Enter = spring({
    frame,
    fps,
    delay: 0,
    config: { damping: 12, stiffness: 180 },
  });

  const word2Enter = spring({
    frame,
    fps,
    delay: 10,
    config: { damping: 14, stiffness: 160 },
  });

  const word3Enter = spring({
    frame,
    fps,
    delay: 20,
    config: { damping: 10, stiffness: 200 },
  });

  const enters = [word1Enter, word2Enter, word3Enter];

  // Horizontal line draw
  const lineDraw = interpolate(frame, [5, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Accent shape entrance
  const accentEnter = spring({
    frame,
    fps,
    delay: 25,
    config: { damping: 8, stiffness: 150 },
  });

  // Subtle camera drift
  const driftX = Math.sin(frame * 0.03) * 10;
  const driftY = Math.cos(frame * 0.025) * 6;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.gold,
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${COLORS.gold} 0%, #FFD068 50%, ${COLORS.gold} 100%)`,
        }}
      />

      {/* Content container with drift */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${driftX}px, ${driftY}px)`,
        }}
      >
        {/* Horizontal divider line */}
        <div
          style={{
            position: "absolute",
            left: width * 0.1,
            top: height * 0.5,
            width: width * 0.8 * lineDraw,
            height: 3,
            backgroundColor: COLORS.navy,
            transformOrigin: "left center",
          }}
        />

        {/* Vertical accent line */}
        <div
          style={{
            position: "absolute",
            left: width * 0.5,
            top: height * 0.15,
            width: 2,
            height: height * 0.7 * lineDraw,
            backgroundColor: `${COLORS.navy}30`,
            transformOrigin: "top center",
          }}
        />

        {/* Words */}
        {WORDS.map((word, i) => {
          const enter = enters[i];
          const xPositions = [width * 0.12, width * 0.38, width * 0.62];
          const yPositions = [height * 0.28, height * 0.55, height * 0.3];
          const sizes = [120, 96, 108];
          const colors = [COLORS.navy, COLORS.berry, COLORS.navy];

          const slideX = interpolate(enter, [0, 1], [-200, 0]);
          const slideRotate = interpolate(enter, [0, 1], [-8, 0]);

          return (
            <div
              key={word}
              style={{
                position: "absolute",
                left: xPositions[i],
                top: yPositions[i],
                transform: `translateX(${slideX}px) rotate(${slideRotate}deg)`,
                opacity: interpolate(enter, [0, 0.3], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <TextAnimation
                className="font-bold tracking-tight"
                style={{
                  fontFamily,
                  fontSize: sizes[i],
                  color: colors[i],
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
                createTimeline={({ textRef, tl, SplitText }) => {
                  const split = new SplitText(textRef.current, {
                    type: "chars",
                  });
                  tl.fromTo(
                    split.chars,
                    {
                      opacity: 0,
                      y: 40,
                      rotationX: -60,
                    },
                    {
                      opacity: 1,
                      y: 0,
                      rotationX: 0,
                      duration: 0.6,
                      stagger: 0.04,
                      ease: "back.out(1.7)",
                    }
                  );
                  return tl;
                }}
                startFrom={i * 10}
              >
                {word}
              </TextAnimation>
            </div>
          );
        })}

        {/* Accent geometric shapes */}
        <div
          style={{
            position: "absolute",
            left: width * 0.82,
            top: height * 0.18,
            transform: `scale(${accentEnter})`,
            opacity: accentEnter,
          }}
        >
          <ShapeAnimation
            shape="triangle"
            animation="rotate"
            size={80}
            color={COLORS.pink}
            speed={0.15}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: width * 0.08,
            top: height * 0.65,
            transform: `scale(${accentEnter})`,
            opacity: accentEnter,
          }}
        >
          <ShapeAnimation
            shape="circle"
            animation="breathe"
            size={50}
            color={COLORS.navy}
            speed={0.4}
            opacity={0.3}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: width * 0.72,
            top: height * 0.72,
            transform: `scale(${accentEnter})`,
            opacity: accentEnter * 0.7,
          }}
        >
          <ShapeAnimation
            shape="hexagon"
            animation="rotate"
            size={45}
            color={COLORS.navy}
            strokeWidth={3}
            speed={0.2}
          />
        </div>

        {/* Small dots pattern */}
        {[
          { x: 0.25, y: 0.15 },
          { x: 0.55, y: 0.82 },
          { x: 0.88, y: 0.48 },
          { x: 0.15, y: 0.48 },
          { x: 0.78, y: 0.88 },
        ].map((pos, i) => {
          const dotEnter = spring({
            frame,
            fps,
            delay: 30 + i * 3,
            config: { damping: 15, stiffness: 200 },
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: width * pos.x,
                top: height * pos.y,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: COLORS.navy,
                transform: `scale(${dotEnter})`,
                opacity: dotEnter * 0.5,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
