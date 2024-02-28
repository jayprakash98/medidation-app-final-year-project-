import { ImageSourcePropType } from "react-native";

export interface TrackProps {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  album: string;
  duration: number;
  image: ImageSourcePropType;
  category: string;
  type: string;
  meditation: [
    {
      time: string;
      instruction: string;
    }
  ];
  pose_description: string;
  pose_benefits: string;
  url_png: string;
  english_name: string;
  sanskrit_name_adapted: string;
  sanskrit_name: string;
  translation_name: string;
  points: number[];
  category_name: string;
}

export interface CategoryProps {
  title: string;
  icon: string;
  category: string;
}

export interface offlineTrackProps {
  name: string;
  path: string;
}

export interface TopicsProps {
  title: string;
  backgroundColor: string;
  image: ImageSourcePropType;
  texture: string;
  category: string;
}
