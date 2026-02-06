import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, useVideoConfig, interpolate } from "remotion";

// ─── SFX Asset URLs ──────────────────────────────────────────
const SFX = {
  // Scene 1: GeoBurst — crystalline geometric expansion
  geoBurst:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770414962932_h57huclio7i_sfx_Crystalline_geometric_impact_b.mp3",

  // Transition: Glitch cut
  glitchBurst:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770414965493_zxzbkk9o4j_sfx_Digital_glitch_distortion_burs.mp3",

  // Scene 2: KineticType — type slam
  typeSlam:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770414972993_gyu4od5bq9_sfx_Heavy_mechanical_type_slam_imp.mp3",

  // Transition: Whip pan
  whipPan:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770414976557_vyjcngtvi1_sfx_Fast_camera_whip_pan_whoosh__m.mp3",

  // Scene 3: LiquidMorph — organic fluid
  liquidMorph:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770414985863_pon30ckb4g_sfx_Underwater_organic_liquid_morp.mp3",

  // Transition: Flash white
  flashImpact:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770414989257_npiov5zucd_sfx_Bright_cinematic_flash_impact_.mp3",

  // Scene 4: GlitchPulse — electric surge
  energySurge:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770414992929_24xaeifful2j_sfx_Electric_power_surge_with_chro.mp3",

  // Scene 5: GeoFinale — cosmic convergence
  cosmicArrive:
    "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770414996882_cxef33smdba_sfx_Cosmic_arrival_tone__celestial.mp3",
} as const;

// ─── Background Music ────────────────────────────────────────
const MUSIC_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/music/1770415027653_q3c769cmylp_music_Dark_cinematic_elect.mp3";

// ─── Timeline Map (at 30 fps) ────────────────────────────────
// TransitionSeries overlap math:
//
// Scene 1 (GeoBurst):    frames 0–89     (90f)
// Glitch transition:     overlaps ~82–89  (8f)
// Scene 2 (KineticType): frames ~82–163   (90f, internal 0 starts at global 82)
// Whip transition:       overlaps ~163    (8f)
// Scene 3 (LiquidMorph): frames ~163–244  (90f)
// Flash transition:      overlaps ~244    (10f)
// Scene 4 (GlitchPulse): frames ~244–315  (80f)
// Blur transition:       overlaps ~315    (12f)
// Scene 5 (GeoFinale):   frames ~315–422  (120f, includes fadeout)
//
// Total: 90+90+90+80+120 - 8-8-10-12 = 432 frames

/**
 * Full sound design layer — sits alongside visuals in Main.
 * Every SFX is synced to a visual event via <Sequence from={globalFrame}>.
 */
export const SoundDesign: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <>
      {/* ── Background Music ─────────────────────────────── */}
      <Audio
        src={MUSIC_URL}
        volume={(f) =>
          interpolate(
            f,
            [0, 15, durationInFrames - 45, durationInFrames],
            [0, 0.3, 0.3, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SCENE 1: GeoBurst (frames 0–89)                    */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* Central dot appears + shapes burst outward */}
      <Sequence from={0}>
        <Audio src={SFX.geoBurst} volume={0.65} />
      </Sequence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* TRANSITION: Glitch cut (~frame 82)                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <Sequence from={80}>
        <Audio src={SFX.glitchBurst} volume={0.6} />
      </Sequence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SCENE 2: KineticType (frames ~82–163)               */}
      {/* Words FORM, FLOW, SHAPE slam in staggered           */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* "FORM" hits */}
      <Sequence from={86}>
        <Audio src={SFX.typeSlam} volume={0.55} />
      </Sequence>

      {/* "FLOW" hits (scene-internal delay ~10f) */}
      <Sequence from={96}>
        <Audio src={SFX.typeSlam} volume={0.45} />
      </Sequence>

      {/* "SHAPE" hits (scene-internal delay ~20f) */}
      <Sequence from={106}>
        <Audio src={SFX.typeSlam} volume={0.5} />
      </Sequence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* TRANSITION: Whip pan (~frame 163)                   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <Sequence from={161}>
        <Audio src={SFX.whipPan} volume={0.6} />
      </Sequence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SCENE 3: LiquidMorph (frames ~163–244)              */}
      {/* Blobs morph in organically                          */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <Sequence from={168}>
        <Audio src={SFX.liquidMorph} volume={0.5} />
      </Sequence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* TRANSITION: Flash white (~frame 244)                */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <Sequence from={242}>
        <Audio src={SFX.flashImpact} volume={0.6} />
      </Sequence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SCENE 4: GlitchPulse (frames ~244–315)              */}
      {/* Chromatic aberration + ENERGY text slam             */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* Electric surge when ENERGY text appears (scene-internal ~15f) */}
      <Sequence from={259}>
        <Audio src={SFX.energySurge} volume={0.55} />
      </Sequence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* TRANSITION: Blur dissolve (~frame 315)              */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* Re-use glitch burst at lower volume for texture */}
      <Sequence from={313}>
        <Audio src={SFX.glitchBurst} volume={0.3} />
      </Sequence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SCENE 5: GeoFinale (frames ~315–432)                */}
      {/* Constellation nodes converge, title resolves        */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <Sequence from={318}>
        <Audio
          src={SFX.cosmicArrive}
          volume={(f) =>
            interpolate(f, [0, 30, 90, 117], [0, 0.5, 0.5, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </Sequence>
    </>
  );
};
