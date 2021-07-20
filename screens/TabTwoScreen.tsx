import BottomSheet, {
  BottomSheetView,
  enableLogging,
} from "@gorhom/bottom-sheet";
enableLogging();
import React, { useCallback, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Button from "./components/Button";

const TabTwoScreen = () => {
  //#region variables
  const searchBottomSheetRef = useRef<BottomSheet>(null);
  const resultBottomSheetRef = useRef<BottomSheet>(null);
  const filtersBottomSheetRef = useRef<BottomSheet>(null);

  const searchSnapPoints = [150, 300, "100%"];
  const resultSnapPoints = [300];
  const filtersSnapPoints = [300];

  const animatedSearchIndex = useSharedValue(0);
  const animatedResultIndex = useSharedValue(0);
  const animatedFiltersIndex = useSharedValue(0);

  const animatedIsFiltersOpen = useSharedValue(false);
  //#endregion

  //#region callbacks
  const handleSearchChange = useCallback((index) => {
    if (animatedIsFiltersOpen.value) {
      return;
    }

    if (index === 0) {
      resultBottomSheetRef.current?.expand();
      return;
    }

    if (index >= 1) {
      resultBottomSheetRef.current?.close();
      return;
    }
  }, []);
  const handleResultChange = useCallback((index) => {
    if (animatedIsFiltersOpen.value) {
      return;
    }

    if (index === -1 && animatedSearchIndex.value < 1) {
      searchBottomSheetRef.current?.snapToIndex(1);
      return;
    }
  }, []);
  const handleFiltersSheetAnimate = useCallback((fromIndex, toIndex) => {
    if (toIndex === -1) {
      resultBottomSheetRef.current?.expand();
      searchBottomSheetRef.current?.collapse();
      animatedIsFiltersOpen.value = false;
    }
  }, []);
  const handleOpenFilterPress = useCallback(() => {
    animatedIsFiltersOpen.value = true;
    filtersBottomSheetRef.current?.expand();
    resultBottomSheetRef.current?.close();
    searchBottomSheetRef.current?.close();
  }, []);
  //#endregion

  return (
    <View style={styles.container}>
      <BottomSheet
        name="result"
        ref={resultBottomSheetRef}
        snapPoints={resultSnapPoints}
        enablePanDownToClose={true}
        animatedIndex={animatedResultIndex}
        backgroundComponent={null}
        handleComponent={null}
        style={styles.resultSheetBackground}
        onChange={handleResultChange}
      >
        <BottomSheetView style={styles.resultContainer}>
          <Text>Result Sheet</Text>
        </BottomSheetView>
      </BottomSheet>
      <BottomSheet
        name="search"
        ref={searchBottomSheetRef}
        snapPoints={searchSnapPoints}
        animatedIndex={animatedSearchIndex}
        onChange={handleSearchChange}
      >
        <View style={styles.searchContainer}>
          <Text>Search Sheet</Text>
          <Button title="open filters" onPress={handleOpenFilterPress} />
        </View>
      </BottomSheet>

      <BottomSheet
        name="filters"
        ref={filtersBottomSheetRef}
        index={-1}
        snapPoints={filtersSnapPoints}
        onAnimate={handleFiltersSheetAnimate}
        enablePanDownToClose={true}
        animatedIndex={animatedFiltersIndex}
      >
        <View style={styles.searchContainer}>
          <Text>Filters Sheet</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 24,
  },
  resultContainer: {
    padding: 24,
  },
  resultSheetBackground: {
    backgroundColor: "lightgrey",
  },
});

export default TabTwoScreen;
