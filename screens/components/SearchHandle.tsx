import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { memo, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useStore } from "../store";

const SearchHandleComponent = () => {
  const setOpenFilters = useStore(
    useCallback((state) => state.setOpenFilters, [])
  );
  const setRunningSearch = useStore(
    useCallback((state) => state.setRunningSearch, [])
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.components}>
          <View style={styles.searchContainer}>
            <BottomSheetTextInput
              placeholder="Search"
              style={[styles.searchInput, { color: "grey" }]}
              clearButtonMode="while-editing"
              // value={searchValue}
              onSubmitEditing={(e: { nativeEvent: { text: string } }) => {
                setRunningSearch(true);
              }}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity onPress={() => setOpenFilters(true)}>
            <View style={styles.filterButton}>
              <Text style={{ color: "grey" }}>Filters</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    height: 55, // SEARCH_BAR_HEIGHT
    justifyContent: "center",
    alignContent: "center",
  },
  components: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    marginLeft: 20,
    padding: 7,
    borderRadius: 8,
  },
  // SearchBar
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    height: 39,
    borderRadius: 8,
  },
  searchIcon: {
    alignSelf: "center",
    lineHeight: 39, // The only way I found (compatible with android) for middle aligning the icon while respecting the height.
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "grey",
  },
});

const SearchHandle = memo(SearchHandleComponent);

export default SearchHandle;
