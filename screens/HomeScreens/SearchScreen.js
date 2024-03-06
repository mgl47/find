import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import Header from "../../components/navigation/Header";
import Screen from "../../components/Screen";
import Svg, { Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg";
import { RNHoleView } from "react-native-hole-view";
import BigTicket from "../../components/tickets/BigTicket";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../components/colors";
// import { Calendar } from "react-native-calendario";
import {Calendar} from 'react-native-calendars';

const SearchScreen = ({ navigation: { goBack }, route }) => {
  const { height, width } = useWindowDimensions();
  const [selected, setSelected] = useState('');

  return (
    <Screen>
      <Header />
      <Calendar
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
      }}
    />
      {/* <Calendar
        onChange={(range) => console.log(range)}
        renderAllMonths={false}
        minDate={new Date(2018, 3, 20)}
        startDate={new Date()}
        endDate={new Date(2018, 4, 5)}
        theme={{
          activeDayColor: {},
          monthTitleTextStyle: {
            color: "#6d95da",
            fontWeight: "300",
            fontSize: 16,
          },
          emptyMonthContainerStyle: {},
          emptyMonthTextStyle: {
            fontWeight: "200",
          },
          weekColumnsContainerStyle: {},
          weekColumnStyle: {
            paddingVertical: 10,
          },
          weekColumnTextStyle: {
            color: "#b6c1cd",
            fontSize: 13,
          },
          nonTouchableDayContainerStyle: {},
          nonTouchableDayTextStyle: {},
          startDateContainerStyle: {},
          endDateContainerStyle: {},
          dayContainerStyle: {},
          dayTextStyle: {
            color: "#2d4150",
            fontWeight: "200",
            fontSize: 15,
          },
          dayOutOfRangeContainerStyle: {},
          dayOutOfRangeTextStyle: {},
          todayContainerStyle: {},
          todayTextStyle: {
            color: "#6d95da",
          },
          activeDayContainerStyle: {
            backgroundColor: "#6d95da",
          },
          activeDayTextStyle: {
            color: "white",
          },
          nonTouchableLastMonthDayTextStyle: {},
        }}
      /> */}
      {/* <BigTicket /> */}
    </Screen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});

// import {
//   StyleSheet,
//   Text,
//   View,
//   useWindowDimensions,
//   Image,
//   ImageBackground,
// } from "react-native";
// import React from "react";
// import Header from "../../components/navigation/Header";
// import Screen from "../../components/Screen";
// import Svg, { Path, Defs, ClipPath, Image as SvgImage } from "react-native-svg";
// import { RNHoleView } from "react-native-hole-view";
// import BigTicket from "../../components/tickets/BigTicket";
// import { LinearGradient } from "expo-linear-gradient";

// const SearchScreen = ({ navigation: { goBack }, route }) => {
//   const { height, width } = useWindowDimensions();

//   return (
//     <Screen>
//       <Header />
//       <View
//         style={{
//           height,
//           width,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <View
//           style={{
//             borderRadius: 20,
//             overflow: "hidden",
//             backgroundColor: "red",
//           }}
//         >
//           <Image
//             style={{
//               height: 195,
//               width: 200,
//               borderRadius: 20,

//               // marginBottom: 50,
//               zIndex: 2,
//               top: 150,
//             }}
//             source={{
//               uri: "https://d1mnxluw9mpf9w.cloudfront.net/media/13277/Rolling-loud-logo.jpg",
//             }}
//           />
//           <LinearGradient
//             // Button Linear Gradient
//             colors={["transparent", "#3b5998", "#192f6a"]}
//             style={{ height: 150, width: 200, zIndex: 2 }}
//           ></LinearGradient>
//         </View>
//       </View>
//       {/* <BigTicket /> */}
//     </Screen>
//   );
// };

// export default SearchScreen;

// const styles = StyleSheet.create({});
