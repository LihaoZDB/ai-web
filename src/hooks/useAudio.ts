export interface Options {
  rate?: number;
  lang?: string;
  pitch?: number;
  volume?: number;
}

let instance: SpeechSynthesisUtterance | null = null;
const getInstance = (options: Options) => {
  if (!instance) {
    instance = new SpeechSynthesisUtterance();
    const { rate = 0.7, lang = "en-US", pitch = 1, volume = 1 } = options;
    instance.rate = rate;
    instance.lang = lang;
    instance.pitch = pitch;
    instance.volume = volume;
  }
  return instance;
};

export const useAudio = (options: Options) => {
  const pronounce = getInstance(options);

  const playAudio = (word: string) => {
    pronounce.text = word;
    speechSynthesis.speak(pronounce);
  };

  return { playAudio };
};
