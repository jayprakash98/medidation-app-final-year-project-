export const faceExpression = (emotionProbability: number): string => {
  // console.log(emotionProbability);
  if (emotionProbability < 0.1) {
    return "Sad";
  } else if (emotionProbability >= 0.1 && emotionProbability < 0.3) {
    return "Neutral";
  } else if (emotionProbability >= 0.5 && emotionProbability < 0.7) {
    return "Pleasant";
  } else if (emotionProbability >= 0.7 && emotionProbability < 0.9) {
    return "Happy";
  } else {
    return "Delighted";
  }
};
