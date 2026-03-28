import React from "react";
import { AbsoluteFill, Html5Audio, staticFile, useVideoConfig } from "remotion";
import {
  linearTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { IntroScene } from "../components/IntroScene";
import { TitleScene } from "../components/TitleScene";
import { SpeakerScene } from "../components/SpeakerScene";
import { HashtagScene } from "../components/HashtagScene";
import { LicenseScene } from "../components/LicenseScene";
import { calculateSceneDurations } from "../utils/timing";
import { resolveTheme } from "../utils/theme";
import type { JawsUgLTProps } from "../types";

export const JawsUgLT: React.FC<JawsUgLTProps> = (props) => {
  const { fps } = useVideoConfig();
  const durations = calculateSceneDurations(props, fps);
  const td = durations.transitionDuration;

  const introTheme = resolveTheme(props.theme, props.introTheme);
  const titleTheme = resolveTheme(props.theme, props.titleTheme);
  const speakerTheme = resolveTheme(props.theme, props.speakerTheme);
  const hashtagTheme = resolveTheme(props.theme, props.hashtagTheme);
  const licenseTheme = resolveTheme(props.theme, props.licenseTheme);

  return (
    <AbsoluteFill style={{ backgroundColor: introTheme.backgroundColor }}>
      {props.musicUrl && (
        <Html5Audio src={staticFile(props.musicUrl)} volume={0.3} />
      )}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={durations.introDuration}>
          <IntroScene
            jawsugIconUrl={props.jawsugIconUrl}
            chapterIconUrl={props.chapterIconUrl}
            chapterName={props.chapterName}
            theme={introTheme}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: td })}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={durations.titleDuration}>
          <TitleScene eventTitle={props.eventTitle} theme={titleTheme} />
        </TransitionSeries.Sequence>
        {props.speakers.map((group, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Transition
              timing={linearTiming({ durationInFrames: td })}
              presentation={i % 2 === 0 ? fade() : slide()}
            />
            <TransitionSeries.Sequence
              durationInFrames={durations.speakerDurations[i]}
            >
              <SpeakerScene speakerGroup={group} index={i} theme={speakerTheme} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: td })}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={durations.hashtagDuration}>
          <HashtagScene hashtag={props.hashtag} theme={hashtagTheme} />
        </TransitionSeries.Sequence>
        {props.musicLicense && (
          <>
            <TransitionSeries.Transition
              timing={linearTiming({ durationInFrames: td })}
              presentation={fade()}
            />
            <TransitionSeries.Sequence durationInFrames={durations.licenseDuration}>
              <LicenseScene musicLicense={props.musicLicense} theme={licenseTheme} />
            </TransitionSeries.Sequence>
          </>
        )}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
