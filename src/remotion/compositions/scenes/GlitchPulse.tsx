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
 * Scene 4: Glitch Pulse
 * High-energy rapid cuts with chromatic shifts and kinetic type.
 */

const COLORS = {
  navy: "#2B2D42",
  blue: "#0496FF",
  gold: "#FFBC42",
  pink: "#D81159",
  berry: "#8F2D56",
  white: "#EDF2F4",
};

interface StrobeBarProps {
  index: number;
  total: number;
  direction: "horizontal" | "vertical";
  color: string;
}

const StrobeBar: React.FC<StrobeBarProps> = ({
  index,
  total,
  direction,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay: index * 2,
    config: { damping: 20, stiffness: 300 },
  });

  const isHorizontal = direction === "horizontal";
  const barSize = (isHorizontal ? height : width) / total;
  const barLength = isHorizontal ? width : height;

  const slide = interpolate(
    enter,
    [0, 1],
    [index % 2 === 0 ? -barLength : barLength, 0],
  );

  return (
    <div
      style={{
        position: "absolute",
        left: isHorizontal ? slide : index * barSize,
        top: isHorizontal ? index * barSize : slide,
        width: isHorizontal ? barLength : barSize - 2,
        height: isHorizontal ? barSize - 2 : barLength,
        backgroundColor: color,
        opacity: enter * 0.9,
      }}
    />
  );
};

export const GlitchPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { fontFamily } = loadSpaceGrotesk();

  // Phase 1: Vertical bars slide in (0-20)
  // Phase 2: Text "ENERGY" appears (15-40)
  // Phase 3: Strobe flash (25-45)
  // Phase 4: Chromatic shift (30-60)

  // Background strobe effect
  const strobeFlash = Math.floor(frame / 4) % 2 === 0;
  const flashOpacity = interpolate(
    frame,
    [25, 30, 45, 50],
    [0, 0.15, 0.15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Chromatic aberration offset
  const chromaOffset = interpolate(frame, [30, 40, 55, 65], [0, 6, 6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Camera shake
  const shakeIntensity = interpolate(frame, [20, 35, 50, 60], [0, 4, 4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 1.5) * shakeIntensity;
  const shakeY = Math.cos(frame * 2.1) * shakeIntensity;

  // Zoom pulse
  const zoomPulse = 1 + Math.sin(frame * 0.15) * 0.02;

  // Cross lines
  const crossEnter = spring({
    frame,
    fps,
    delay: 10,
    config: { damping: 25, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.pink,
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${zoomPulse})`,
      }}
    >
      {/* Diagonal gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(45deg, ${COLORS.pink} 0%, ${COLORS.berry} 100%)`,
        }}
      />

      {/* Strobe flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: strobeFlash ? COLORS.white : COLORS.navy,
          opacity: flashOpacity,
        }}
      />

      {/* Vertical strobe bars */}
      {Array.from({ length: 8 }).map((_, i) => (
        <StrobeBar
          key={`v-${i}`}
          index={i}
          total={8}
          direction="vertical"
          color={i % 2 === 0 ? `${COLORS.navy}15` : `${COLORS.white}08`}
        />
      ))}

      {/* Cross lines */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: height / 2 - 1,
          width: width * crossEnter,
          height: 2,
          backgroundColor: COLORS.white,
          transformOrigin: "left center",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width / 2 - 1,
          top: 0,
          width: 2,
          height: height * crossEnter,
          backgroundColor: COLORS.white,
          transformOrigin: "top center",
          opacity: 0.6,
        }}
      />

      {/* Main text with chromatic aberration */}
      <div
        style={{
          position: "absolute",
          left: width * 0.5 - 350,
          top: height * 0.32,
          width: 700,
          textAlign: "center",
        }}
      >
        {/* Red channel offset */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${chromaOffset}px, ${-chromaOffset * 0.5}px)`,
            opacity: chromaOffset > 0 ? 0.5 : 0,
            mixBlendMode: "screen",
          }}
        >
          <TextAnimation
            className="font-bold text-center"
            style={{
              fontFamily,
              fontSize: 140,
              color: "#FF000080",
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.fromTo(
                split.chars,
                { opacity: 0, scale: 1.8 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.4,
                  stagger: 0.02,
                  ease: "expo.out",
                },
              );
              return tl;
            }}
            startFrom={15}
          >
            ENERGY
          </TextAnimation>
        </div>

        {/* Blue channel offset */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${-chromaOffset}px, ${chromaOffset * 0.5}px)`,
            opacity: chromaOffset > 0 ? 0.5 : 0,
            mixBlendMode: "screen",
          }}
        >
          <TextAnimation
            className="font-bold text-center"
            style={{
              fontFamily,
              fontSize: 140,
              color: "#0000FF80",
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.fromTo(
                split.chars,
                { opacity: 0, scale: 1.8 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.4,
                  stagger: 0.02,
                  ease: "expo.out",
                },
              );
              return tl;
            }}
            startFrom={15}
          >
            ENERGY
          </TextAnimation>
        </div>

        {/* Main text layer */}
        <TextAnimation
          className="font-bold text-center"
          style={{
            fontFamily,
            fontSize: 140,
            color: COLORS.white,
            lineHeight: 1,
            letterSpacing: "-0.05em",
            textShadow: `0 0 40px ${COLORS.white}40`,
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.fromTo(
              split.chars,
              { opacity: 0, scale: 1.8, y: -20 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.03,
                ease: "expo.out",
              },
            );
            return tl;
          }}
          startFrom={15}
        >
          ENERGY
        </TextAnimation>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          left: width * 0.5 - 200,
          top: height * 0.58,
          width: 400,
          textAlign: "center",
        }}
      >
        <TextAnimation
          style={{
            fontFamily,
            fontSize: 18,
            color: `${COLORS.white}C0`,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.fromTo(
              split.words,
              { opacity: 0, x: -30 },
              {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power3.out",
              },
            );
            return tl;
          }}
          startFrom={30}
        >
          in every pixel
        </TextAnimation>
      </div>

      {/* Corner accent shapes */}
      {[
        { x: 60, y: 60, rot: 0 },
        { x: width - 120, y: 60, rot: 90 },
        { x: width - 120, y: height - 120, rot: 180 },
        { x: 60, y: height - 120, rot: 270 },
      ].map((corner, i) => {
        const cornerEnter = spring({
          frame,
          fps,
          delay: 5 + i * 4,
          config: { damping: 15, stiffness: 200 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: corner.x,
              top: corner.y,
              width: 60,
              height: 60,
              border: `2px solid ${COLORS.white}40`,
              transform: `rotate(${corner.rot + frame * 0.5}deg) scale(${cornerEnter})`,
              opacity: cornerEnter * 0.6,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
