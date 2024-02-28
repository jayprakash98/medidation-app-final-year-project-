import { TrackProps } from "@constants/Interfaces";
import { SafeView } from "@elements/SharedElements";
import useNavHelper from "@hooks/useNavHelper";
import { tracks } from "@screens/MusicView/tracks";
import BackHeader from "@shared/BackHeader";
import MusicCard from "@shared/MusicCard";
import { HomeSkeleton } from "@shared/Skeletons";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const TopicMusic = (props: any) => {
  const { item: topicItem }: { item: TrackProps } = props.route.params;
  const [data, setData] = useState([]);
  const { goToMusicPage } = useNavHelper();

  useEffect(() => {
    setTimeout(() => {
      setData(
        tracks.filter((track: TrackProps) =>
          track.type.includes(topicItem.category)
        )
      );
    }, 200);
    return () => {
      setData([]);
    };
  }, [topicItem.category]);

  return (
    <SafeView>
      <ScrollView>
        <BackHeader title={topicItem.title} />

        <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
          {data.length === 0 && <HomeSkeleton />}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {data.length > 0 &&
              data.map((item: TrackProps, index: number) => (
                <View key={index}>
                  <MusicCard
                    onPress={() => goToMusicPage(item)}
                    {...{ item }}
                  />
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default TopicMusic;
