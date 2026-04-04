import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import { getAudioData, visualizeAudio } from "@remotion/media-utils";
import type { AudioData } from "@remotion/media-utils";

interface AudioPulseValue {
  /** Overall energy 0-1 */
  pulse: number;
  /** Low-frequency (bass) energy 0-1 */
  bass: number;
  /** Full frequency spectrum (0-1 per bin) */
  frequencies: number[];
}

const EMPTY_FREQUENCIES: number[] = [];

const AudioPulseContext = createContext<AudioPulseValue>({
  pulse: 0,
  bass: 0,
  frequencies: EMPTY_FREQUENCIES,
});

export const useAudioPulse = () => useContext(AudioPulseContext);

export const AudioPulseProvider: React.FC<{
  musicUrl?: string;
  children: React.ReactNode;
}> = ({ musicUrl, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [handle] = useState<number | null>(() =>
    musicUrl ? delayRender("Loading audio data for pulse") : null,
  );

  useEffect(() => {
    if (!musicUrl) return;

    getAudioData(staticFile(musicUrl))
      .then((data) => {
        setAudioData(data);
        if (handle !== null) continueRender(handle);
      })
      .catch(() => {
        if (handle !== null) continueRender(handle);
      });
  }, [musicUrl, handle]);

  let pulse = 0;
  let bass = 0;
  let frequencies = EMPTY_FREQUENCIES;

  if (audioData) {
    frequencies = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 128,
    });

    // Bass: average of lowest 8 bins
    bass = frequencies.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
    // Overall energy
    pulse = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
  }

  return (
    <AudioPulseContext.Provider value={{ pulse, bass, frequencies }}>
      {children}
    </AudioPulseContext.Provider>
  );
};
