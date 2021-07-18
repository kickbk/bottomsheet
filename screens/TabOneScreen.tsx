import React, { useMemo, useRef, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Text, Keyboard } from "react-native";
import BottomSheet, {
  enableLogging,
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import MapView, { Region } from "react-native-maps";
import SearchHandle from "./components/SearchHandle";
import Button from "./components/Button";
import { useStore } from "./store";

const TabOneScreen = () => {
  // refs
  const searchSheetRef = useRef<BottomSheet>(null);
  const resultsCarouselRef = useRef<BottomSheet>(null);
  const filtersModalRef = useRef<BottomSheetModal>(null);

  const isDraggingMap = useRef(false);
  const isAlertShown = useRef(false);
  const isFilterShown = useRef(false);
  const searchModalCurrentIndex = useRef(0);

  // variables
  const snapPoints = useMemo(() => [60, 300, "100%"], []);
  const resultsCarouselSnapPoints = useMemo(() => [0, 300], []);
  const filtersModalSnapPoints = useMemo(() => [300], []);

  const INITIAL_REGION = {
    latitude: 34.181734,
    longitude: -118.311446,
    latitudeDelta: 0.01, // Change to 0.07 when launching
    longitudeDelta: 0.01,
  };

  const setAlert = useStore((state) => state.setAlert);
  const openFilters = useStore(useCallback((state) => state.openFilters, []));
  const setOpenFilters = useStore(
    useCallback((state) => state.setOpenFilters, [])
  );
  const runningSearch = useStore(
    useCallback((state) => state.runningSearch, [])
  );
  const setRunningSearch = useStore(
    useCallback((state) => state.setRunningSearch, [])
  );

  const renderResultsCarousel = useMemo(
    () => (
      <View
        style={{
          backgroundColor: "grey",
          flex: 1,
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <Text style={{ color: "white" }}>RESULTS</Text>
      </View>
    ),
    []
  );

  const renderSearchSheet = useMemo(
    () => (
      <View
        style={{
          backgroundColor: "blue",
          flex: 1,
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <Text style={{ color: "white" }}>SEARCH SHEET CONTENT</Text>
      </View>
    ),
    []
  );

  const renderFilters = useMemo(
    () => (
      <View
        style={{
          backgroundColor: "blue",
          flex: 1,
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <Text style={{ color: "white" }}>FILTERS SHEET CONTENT</Text>
      </View>
    ),
    []
  );

  // callbacks
  const handleExpandPress = useCallback(() => {
    searchSheetRef.current?.expand();
  }, []);
  const handleCollapsePress = useCallback(() => {
    searchSheetRef.current?.collapse();
  }, []);
  const handleClosePress = useCallback(() => {
    searchSheetRef.current?.close();
  }, []);

  const handleSearchSheetChange = useCallback((index: number) => {
    console.log("SEARCH SHEET SNAPPED TO INDEX", index);
    searchModalCurrentIndex.current = index;
    if (index === 0 && !isDraggingMap.current) {
      resultsCarouselRef.current?.expand();
    } else if (index >= 1) {
      resultsCarouselRef.current?.close();
    }
  }, []);

  const handleSearchSheetAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === 2) {
        console.log("CLOSING FILTERS SHEET");
        filtersModalRef.current?.dismiss();
      }
    },
    []
  );

  const handleResultSheetChange = useCallback((index: number) => {
    /* Handle manually dragging down the results carousel and opening search sheet to index 1
     * Do NOT fire if the carousel was closed by:
     * - Refreshing search results
     * - Manually opening Search sheet (then searchModalCurrentIndex.current will not be 0)
     * - Showing the Alerts sheet
     * - Showing the Filters sheet
     * - Dragging the map
     */
    // console.log({index, searchModalCurrentIndex: searchModalCurrentIndex.current, isDraggingMap: isDraggingMap.current, isFilterShown: isFilterShown.current, alert: !alert  })
    if (
      index === 0 &&
      searchModalCurrentIndex.current === 0 &&
      !isDraggingMap.current && // BUG: MapView - Currently onTouchEnd doesn't fire on iOS, so we relay on onPanDrag to set isDraggingMap to false.
      !isFilterShown.current
      // !alert
    ) {
      // console.log("Should be expanding searchSheet")
      searchSheetRef.current?.snapToIndex(1);
    }
  }, []);

  const handleFiltersChange = useCallback((index: number) => {
    if (index === -1) {
      isFilterShown.current = false;
      resultsCarouselRef.current?.expand();
      searchSheetRef.current?.collapse();
    } else {
      isFilterShown.current = true;
      resultsCarouselRef.current?.close();
      searchSheetRef.current?.close();
    }
  }, []);

  const handleMapPanDrag = useCallback(() => {
    if (!isDraggingMap.current) {
      // BUG: If hardly moving map, a `onRegionChangeComplete` will never fire, so carousel will remain hidden. However, another slight move on the map will restore the carousel.
      isDraggingMap.current = true;
      resultsCarouselRef.current?.collapse(); // DO NOT USE .close() - It is uninterruptible.
    }
  }, []);

  const handleMapRegionChangeComplete = useCallback((newRegion: Region) => {
    if (isDraggingMap.current) {
      resultsCarouselRef.current?.expand();
    }
    isDraggingMap.current = false; // Reset dragging state once search finished. Hides hidden buttons.
  }, []);

  //#region effects

  // Open filters
  useEffect(() => {
    if (openFilters) {
      Keyboard.dismiss(); // TODO: https://github.com/gorhom/react-native-bottom-sheet/discussions/233#discussioncomment-607682
      isFilterShown.current = true;
      searchSheetRef.current?.collapse();
      filtersModalRef.current?.present();
    }
    return () => {
      setOpenFilters(false);
    };
  }, [openFilters, setOpenFilters]);

  // Simulate response to search - Dismiss search BottomSheet when submitting TextInput value (as in the case of processing search)
  useEffect(() => {
    if (runningSearch) {
      searchSheetRef.current?.collapse();
    }
    return () => {
      setRunningSearch(false);
    };
  }, [runningSearch, setRunningSearch]);

  //#endregion

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          flex: 1,
          paddingVertical: 64,
          justifyContent: "flex-start",
          backgroundColor: "#222",
        }}
      >
        <MapView
          style={{ flexGrow: 1 }}
          showsPointsOfInterest={false}
          showsMyLocationButton={false} // Removes the recenter button on android
          showsIndoors={false}
          showsBuildings={false}
          showsCompass={false}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          onPanDrag={handleMapPanDrag} // Docs mention we need to set scrollEnabled to false to trigger on iOS, but seems to work without.
          onRegionChangeComplete={handleMapRegionChangeComplete}
        />
        <View style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
          <Button onPress={handleExpandPress} title="Expand" />
          <Button onPress={handleCollapsePress} title="Collapse" />
          <Button onPress={handleClosePress} title="Close" />
        </View>
        <BottomSheet
          ref={resultsCarouselRef}
          key="result-sheet"
          snapPoints={resultsCarouselSnapPoints}
          index={-1}
          enablePanDownToClose
          handleComponent={null}
          backgroundComponent={null}
          onChange={handleResultSheetChange}
          children={renderResultsCarousel}
        />
        <BottomSheet
          ref={searchSheetRef}
          key="search-sheet"
          snapPoints={snapPoints}
          keyboardBehavior="interactive"
          handleComponent={SearchHandle}
          animateOnMount={true}
          android_keyboardInputMode="adjustPan"
          onChange={handleSearchSheetChange}
          onAnimate={handleSearchSheetAnimate}
        >
          <Text>LIST</Text>
        </BottomSheet>
        <BottomSheetModal
          ref={filtersModalRef}
          key="filters-sheet-modal"
          snapPoints={filtersModalSnapPoints}
          handleComponent={null}
          onChange={handleFiltersChange}
          children={renderFilters}
        />
      </View>
    </BottomSheetModalProvider>
  );
};

export default TabOneScreen;
