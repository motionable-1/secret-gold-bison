import React from "react";
import { AbsoluteFill, Artifact, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { GeoBurst } from "./scenes/GeoBurst";
import { KineticType } from "./scenes/KineticType";
import { LiquidMorph } from "./scenes/LiquidMorph";
import { GlitchPulse } from "./scenes/GlitchPulse";
import { GeoFinale } from "./scenes/GeoFinale";
import { flashWhite } from "../library/components/layout/transitions/presentations/flashWhite";
import { whipPan } from "../library/components/layout/transitions/presentations/whipPan";
import { glitch } from "../library/components/layout/transitions/presentations/glitch";
import { blurDissolve } from "../library/components/layout/transitions/presentations/blurDissolve";
import { SoundDesign } from "./SoundDesign";

// Timeline @ 30fps
// Scene 1 (GeoBurst):    90f  = 3.0s
// Transition (glitch):   8f
// Scene 2 (KineticType): 90f  = 3.0s
// Transition (whipPan):  8f
// Scene 3 (LiquidMorph): 90f  = 3.0s
// Transition (flashWht): 10f
// Scene 4 (GlitchPulse): 80f  = 2.7s
// Transition (blurDiss): 12f
// Scene 5 (GeoFinale):   120f = 4.0s (hold + fadeout)
// Total: 90+90+90+80+120 - 8-8-10-12 = 432 frames ≈ 14.4s

export const Main: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}
      <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
        {/* Sound Design Layer */}
        <SoundDesign />

        <TransitionSeries>
          {/* Scene 1: Geometric Burst — shapes explode from center */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <GeoBurst />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={glitch()}
            timing={linearTiming({ durationInFrames: 8 })}
          />

          {/* Scene 2: Kinetic Typography — FORM / FLOW / SHAPE */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <KineticType />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={whipPan()}
            timing={linearTiming({ durationInFrames: 8 })}
          />

          {/* Scene 3: Liquid Morph — organic blobs + DISSOLVE */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <LiquidMorph />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={flashWhite()}
            timing={linearTiming({ durationInFrames: 10 })}
          />

          {/* Scene 4: Glitch Pulse — chromatic ENERGY */}
          <TransitionSeries.Sequence durationInFrames={80}>
            <GlitchPulse />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={blurDissolve()}
            timing={linearTiming({ durationInFrames: 12 })}
          />

          {/* Scene 5: Geometric Finale — constellation convergence */}
          <TransitionSeries.Sequence durationInFrames={120}>
            <GeoFinale />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </>
  );
};
