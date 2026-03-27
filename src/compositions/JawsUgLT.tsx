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
import type { JawsUgLTProps } from "../types";

export const JawsUgLT: React.FC<JawsUgLTProps> = (props) => {
  const { fps } = useVideoConfig();
  const durations = calculateSceneDurations(props, fps);
  const td = durations.transitionDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a2e" }}>
      {props.musicUrl && (
        <Html5Audio src={staticFile(props.musicUrl)} volume={0.3} />
      )}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={durations.introDuration}>
          <IntroScene
            jawsugIconUrl={props.jawsugIconUrl}
            chapterIconUrl={props.chapterIconUrl}
            chapterName={props.chapterName}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: td })}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={durations.titleDuration}>
          <TitleScene eventTitle={props.eventTitle} />
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
              <SpeakerScene speakerGroup={group} index={i} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: td })}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={durations.hashtagDuration}>
          <HashtagScene hashtag={props.hashtag} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: td })}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={durations.licenseDuration}>
          <LicenseScene musicLicense={props.musicLicense} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
