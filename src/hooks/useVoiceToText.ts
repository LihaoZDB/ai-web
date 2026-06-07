import { ref } from "vue";

let instance: SpeechRecognition | null = null;

export interface Options {
  lang?: string; // 语言
  continuous?: boolean; // 是否连续识别  默认false机制 也就是说完一句话或者没有声音了就自动停止，如果设置为ture，则需要收手动停止
  interimResults?: boolean; // 是否返回中间结果 默认false 类似于sse
  maxAlternatives?: number; // 最大备选结果数 默认是1 举个例子设置为3 说了apple 可能会识别3个结果 apple apples apple pie
}

const getInstance = (options: Options): SpeechRecognition => {
  const speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!speechRecognition) {
    throw new Error("SpeechRecognition is not supported"); // 浏览器不支持语音识别
  }
  if (!instance) {
    const {
      lang = "zh-CN",
      continuous = false,
      interimResults = false,
      maxAlternatives = 1,
    } = options;
    instance = new speechRecognition();
    instance.lang = lang;
    instance.continuous = continuous;
    instance.interimResults = interimResults;
    instance.maxAlternatives = maxAlternatives;
  }
  return instance;
};

export const useVoiceToText = (options: Options) => {
  const recognition = getInstance(options);
  const isRecording = ref(false); // 是否正在录音
  recognition.onend = () => {
    isRecording.value = false;
  };
  // 开启语音转文字
  const start = (callback?: (result: string) => void) => {
    isRecording.value = true;
    recognition.start();
    recognition.onresult = (event) => {
      let fullText = "";
      for (let i = 0; i < event.results.length; i++) {
        fullText += event.results[i][0].transcript;
      }
      callback?.(fullText);
      console.log(fullText);
    };
  };
  const stop = () => {
    isRecording.value = false;
    recognition.stop();
  };
  return { isRecording, start, stop };
};
