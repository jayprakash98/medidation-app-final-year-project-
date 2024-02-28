const ANGRY = "sad";
const SAD = "sad";
const NEUTRAL = "neutral";
const PLEASANT = "pleasant";
const HAPPY = "happy";
const DELIGHTED = "delighted";

export const topics = [
  {
    title: "Reduce Stress",
    backgroundColor: "#808AFF",
    image: require("../../../assets/images/1.png"),
    texture: "dark",
    category: "stressreducer",
    mood: [ANGRY, SAD],
  },
  {
    title: "Improve Concentration",
    backgroundColor: "#FC6D5C",
    image: require("../../../assets/images/2.png"),
    texture: "dark",
    category: "performanceimprove",
    mood: [NEUTRAL, PLEASANT, HAPPY, DELIGHTED],
  },
  {
    title: "Increase Happiness",
    backgroundColor: "#FEB18F",
    image: require("../../../assets/images/3.png"),
    texture: "light",
    category: "happinessincrease",
    mood: [HAPPY, NEUTRAL, ANGRY, SAD],
  },
  {
    title: "Reduce Anxiety",
    backgroundColor: "#FFCF86",
    image: require("../../../assets/images/4.png"),
    texture: "light",
    category: "anxityreduce",
    mood: [SAD, ANGRY],
  },
  {
    title: "Personal Growth",
    backgroundColor: "#6CB28E",
    image: require("../../../assets/images/5.png"),
    texture: "dark",
    category: "personalgrowth",
    mood: [HAPPY, PLEASANT, DELIGHTED],
  },
  {
    title: "Better Sleep",
    backgroundColor: "#3F414E",
    image: require("../../../assets/images/6.png"),
    texture: "dark",
    category: "bettersleep",
    mood: [HAPPY, SAD, NEUTRAL],
  },
];
