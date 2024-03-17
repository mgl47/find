import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import VideoImput from "./VideoInput";

function VideoInputList({ videoUris = [], onRemoveVideo, onAddVideo }) {
  const scrollView = useRef();
  return (
    <ScrollView
      ref={scrollView}
      horizontal
      pagingEnabled
      onContentSizeChange={() => scrollView.current.scrollToEnd()}
    >
      <View style={styles.container}>
        {videoUris.map((uri) => (
          <View key={uri} style={styles.image}>
            <VideoImput
              videoUri={uri}
              onChangeVideo={() => onRemoveVideo(uri)}
            />
          </View>
        ))}

        <VideoImput onChangeVideo={(uri) => onAddVideo(uri)} />
      </View>
    </ScrollView>
  );
}

export default VideoInputList;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    // marginRight: 10,
  },
});
