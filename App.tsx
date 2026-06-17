import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from "react-native";

import OTAHotUpdate from "react-native-ota-hot-update";
import ReactNativeBlobUtil from "react-native-blob-util";
import Share from "react-native-share";

const BUNDLE_NAME =
  Platform.OS === "android" ? "index.android.bundle" : "main.jsbundle";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.myapp";

type Status = "checking" | "latest" | "downloading" | "ready" | "error";

export default function App() {
  const [status, setStatus] = useState<Status>("checking");
  const [localVer, setLocalVer] = useState("");
  const [remoteVer, setRemoteVer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function checkOTA() {
    setStatus("checking");
    setErrorMsg("");
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/fatimatuzzohra313/Otachecking/main/ota/version.json"
      );
      const remote = await res.json();
      const localVersion = await OTAHotUpdate.getCurrentVersion();

      setLocalVer(String(localVersion));
      setRemoteVer(remote.version);

      if (localVersion !== remote.version) {
        setStatus("downloading");

        const destPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${BUNDLE_NAME}`;
        const dl = await ReactNativeBlobUtil.config({
          path: destPath,
          fileCache: true,
        }).fetch("GET", remote.bundleUrl);

        const downloadedPath = dl.path();
        const success = await OTAHotUpdate.setupExactBundlePath(downloadedPath);
        if (success) {
          await OTAHotUpdate.setCurrentVersion(remote.version);
          setStatus("ready");
        } else {
          setStatus("error");
          setErrorMsg("Failed to install bundle");
        }
      } else {
        setStatus("latest");
      }
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message || String(e));
    }
  }

  const shareApp = useCallback(() => {
    Share.open({
      message: `Check out this app!\n${PLAY_STORE_URL}`,
      url: PLAY_STORE_URL,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    checkOTA();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FatimasApp</Text>

      <View style={styles.card}>
        {status === "checking" && (
          <>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={styles.statusText}>Checking for updates...</Text>
          </>
        )}

        {status === "latest" && (
          <>
            <Text style={styles.greenIcon}>✓</Text>
            <Text style={styles.statusText}>App is up to date</Text>
            <Text style={styles.versionText}>v{localVer}</Text>
          </>
        )}

        {status === "downloading" && (
          <>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={styles.statusText}>Downloading update...</Text>
            <Text style={styles.versionText}>
              v{localVer} → v{remoteVer}
            </Text>
          </>
        )}

        {status === "ready" && (
          <>
            <Text style={styles.greenIcon}>⬇</Text>
            <Text style={styles.statusText}>Update ready to install</Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => OTAHotUpdate.resetApp()}
            >
              <Text style={styles.btnText}>Restart Now</Text>
            </TouchableOpacity>
          </>
        )}

        {status === "error" && (
          <>
            <Text style={styles.redIcon}>!</Text>
            <Text style={styles.statusText}>Update check failed</Text>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.btn} onPress={checkOTA}>
              <Text style={styles.btnText}>Retry</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.checkBtn} onPress={checkOTA}>
        <Text style={styles.checkBtnText}>Check for Updates</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareBtn} onPress={shareApp}>
        <Text style={styles.shareBtnText}>Share on WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.storeBtn}
        onPress={() => Linking.openURL(PLAY_STORE_URL)}
      >
        <Text style={styles.storeBtnText}>Rate on Play Store</Text>
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
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginBottom: 24,
  },
  greenIcon: {
    fontSize: 40,
    color: "#2ECC71",
    marginBottom: 12,
  },
  redIcon: {
    fontSize: 40,
    color: "#E74C3C",
    fontWeight: "700",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    color: "#888",
  },
  errorText: {
    fontSize: 12,
    color: "#E74C3C",
    textAlign: "center",
    marginBottom: 16,
  },
  btn: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 16,
  },
  btnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  checkBtn: {
    borderWidth: 1.5,
    borderColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  checkBtnText: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "600",
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
});