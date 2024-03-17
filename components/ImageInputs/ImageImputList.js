import React, { useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ImageImput from "./ImageImput";
import { ScrollView } from "react-native";

function ImageImputList({
  imageUris = [],
  onRemoveImage,
  onAddImage,
  handleImageScroll,
  setScrollIndex,
}) {
  const scrollView = useRef();

  function handleOnScroll(event) {
    setScrollIndex(
      event.nativeEvent.contentOffset.x / Dimensions.get("window").width
    );
    //calculate screenIndex by contentOffset and screen width
    console.log(
      "currentScreenIndex",
      parseInt(
        event.nativeEvent.contentOffset.x / Dimensions.get("window").width
      )
    );
  }
  // console.log(scrollView.current.index);
  return (
    <ScrollView
      // onScroll={(e) => handleImageScroll(e)}
      // scrollEventThrottle={16}
      ref={scrollView}
      horizontal
      pagingEnabled
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
    // marginRight: 10,
  },
});
