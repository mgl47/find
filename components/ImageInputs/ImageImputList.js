import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import ImageImput from "./ImageImput";
import { ScrollView } from "react-native";

function ImageImputList({ imageUris = [], onRemoveImage, onAddImage }) {
  const scrollView = useRef();

  return (
    <ScrollView
      ref={scrollView}
      horizontal
      onContentSizeChange={() => scrollView.current.scrollToEnd()}
    >
      <View style={styles.container}>
        {imageUris.map((uri) => (
          <View key={uri} style={styles.image}>
            <ImageImput
              imageUri={uri}
              onChangeImage={() => onRemoveImage(uri)}
            />
          </View>
        ))}

        <ImageImput onChangeImage={(uri) => onAddImage(uri)} />
      </View>
    </ScrollView>
  );
}

export default ImageImputList;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    marginRight: 10,
  },
});
