import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
  } from "@gorhom/bottom-sheet";

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
<BottomSheetModalProvider>
<View style={styles.sheetContainer}>
  <BottomSheetModal
    ref={bottomSheetModalRef}
    index={1}
    snapPoints={snapPoints}
  >
    <BottomSheetView style={styles.contentContainer}>
      <Text>Awesome 🎉</Text>
    </BottomSheetView>
  </BottomSheetModal>
</View>
</BottomSheetModalProvider>