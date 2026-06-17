import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import OTAHotUpdate from "react-native-ota-hot-update";
import RNFS from "react-native-fs";

const BUNDLE_PATH = RNFS.DocumentDirectoryPath + "/index.android.bundle";

type Status = "checking" | "latest" | "downloading" | "ready" | "error";

function setupOTA() {
  OTAHotUpdate.setupBundlePath(BUNDLE_PATH, "index.android.bundle", 1, 10, {});
}

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
        await OTAHotUpdate.downloadBundleUri(
          remote.bundleUrl,
          "index.android.bundle",
          1,
          {
            restartAfterInstall: false,
            updateSuccess: () => {
              setStatus("ready");
            },
            updateFail: (msg: string) => {
              setStatus("error");
              setErrorMsg(msg);
            },
          }
        );
        OTAHotUpdate.setCurrentVersion(remote.version);
      } else {
        setStatus("latest");
      }
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message || String(e));
    }
  }

  useEffect(() => {
    setupOTA();
    checkOTA();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MyApp</Text>

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
});