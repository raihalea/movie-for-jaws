import type { JawsUgLTProps } from "../types";

export interface SceneDurations {
  introDuration: number;
  titleDuration: number;
  speakerDurations: number[];
  hashtagDuration: number;
  licenseDuration: number;
  transitionDuration: number;
}

export function calculateSceneDurations(
  props: JawsUgLTProps,
  fps: number,
): SceneDurations {
  const totalFrames = Math.round(props.musicDurationInSeconds * fps);
  const transitionDuration = 15;

  const introDuration = Math.round(3 * fps);
  const titleDuration = Math.round(4 * fps);
  const hashtagDuration = Math.round(3 * fps);
  const licenseDuration = Math.round(3 * fps);
  const fixedSequenceFrames =
    introDuration + titleDuration + hashtagDuration + licenseDuration;

  const numSpeakerGroups = props.speakers.length;

  // Number of transitions:
  // intro->title, title->speaker1, speaker1->speaker2, ..., lastSpeaker->hashtag, hashtag->license
  // = 1 + 1 + (numSpeakerGroups - 1) + 1 + 1 = numSpeakerGroups + 3
  const numTransitions = numSpeakerGroups + 3;
  const totalTransitionFrames = numTransitions * transitionDuration;

  // TransitionSeries total = sum(sequences) - sum(transitions)
  // We need: totalFrames = sum(sequences) - totalTransitionFrames
  // So: sum(sequences) = totalFrames + totalTransitionFrames
  const availableForSequences = totalFrames + totalTransitionFrames;
  const speakerFramesTotal = availableForSequences - fixedSequenceFrames;

  const baseSpeakerDuration = Math.floor(speakerFramesTotal / numSpeakerGroups);
  let remainder = speakerFramesTotal - baseSpeakerDuration * numSpeakerGroups;

  const speakerDurations: number[] = [];
  for (let i = 0; i < numSpeakerGroups; i++) {
    if (remainder > 0) {
      speakerDurations.push(baseSpeakerDuration + 1);
      remainder--;
    } else {
      speakerDurations.push(baseSpeakerDuration);
    }
  }

  return {
    introDuration,
    titleDuration,
    speakerDurations,
    hashtagDuration,
    licenseDuration,
    transitionDuration,
  };
}
