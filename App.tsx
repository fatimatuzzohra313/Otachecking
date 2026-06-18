import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import RNFS from "react-native-fs";
import OTAHotUpdate from "react-native-ota-hot-update";
import Share from "react-native-share";

const BUNDLE_NAME =
  Platform.OS === "android" ? "index.android.bundle" : "main.jsbundle";
const GITHUB_RAW = "https://raw.githubusercontent.com/fatimatuzzohra313/Otachecking/pla/ota";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.myapp";

export default function App() {
  async function checkOTA() {
    try {
      const verRes = await fetch(`${GITHUB_RAW}/version.json`);
      const remote = await verRes.json();
      const localVersion = await OTAHotUpdate.getCurrentVersion();

      if (localVersion !== remote.version) {
        const destPath = `${RNFS.DocumentDirectoryPath}/${BUNDLE_NAME}`;
        const dl = RNFS.downloadFile({
          fromUrl: remote.bundleUrl,
          toFile: destPath,
        });
        const result = await dl.promise;
        if (result.statusCode === 200) {
          const success = await OTAHotUpdate.setupExactBundlePath(destPath);
          if (success) {
            await OTAHotUpdate.setCurrentVersion(remote.version);
            await OTAHotUpdate.resetApp();
          }
        }
      }
    } catch (_) {}
  }

  useEffect(() => {
    const timer = setTimeout(() => checkOTA(), 3000);
    return () => clearTimeout(timer);
  }, []);

  const shareApp = useCallback(() => {
    Share.open({
      message: `Check out this app!\n${PLAY_STORE_URL}`,
      url: PLAY_STORE_URL,
    }).catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Fatima App V3</Text>

      <TouchableOpacity style={styles.shareBtn} onPress={shareApp}>
        <Text style={styles.shareBtnText}>Share on WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.storeBtn}
        onPress={() => Linking.openURL(PLAY_STORE_URL)}
      >
        <Text style={styles.storeBtnText}>Rate on Play Store</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.payBtn} disabled>
        <Text style={styles.payBtnText}>Payment (Current Month Paid)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5FA",
    padding: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 32,
  },
  shareBtn: {
    backgroundColor: "#25D366",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  shareBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  storeBtn: {
    borderWidth: 1.5,
    borderColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  storeBtnText: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "600",
  },
  payBtn: {
    backgroundColor: "#B0B0B0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
    opacity: 0.6,
  },
  payBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
