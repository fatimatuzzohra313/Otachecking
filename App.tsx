import React, { useEffect } from "react";
import { View, Text, Alert } from "react-native";

import OTAHotUpdate from "react-native-ota-hot-update";
import RNFS from "react-native-fs";

const BUNDLE_PATH =
  RNFS.DocumentDirectoryPath + "/index.android.bundle";

/**
 * 🔧 SETUP BUNDLE SYSTEM
 */
function setupOTA() {
  OTAHotUpdate.setupBundlePath(
    BUNDLE_PATH,
    "index.android.bundle",
    1,
    10,
    {}
  );
}

/**
 * 🚀 GITHUB OTA CHECK (CUSTOM LOGIC)
 */
async function checkOTA() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/fatimatuzzohra313/Otachecking/main/ota/version.json"
    );

    const remote = await res.json();

    const localVersion = await OTAHotUpdate.getCurrentVersion();

    console.log("Local:", localVersion);
    console.log("Remote:", remote.version);

    if (localVersion !== remote.version) {
      console.log("🚀 Update found");

      Alert.alert("Update Found", "Downloading update...");

      /**
       * 📥 DOWNLOAD (from UpdateOption concept)
       */
      await OTAHotUpdate.downloadBundleUri(
        remote.bundleUrl,
        "index.android.bundle",
        1,
        {
          restartAfterInstall: false,
          updateSuccess: () => {
            console.log("✅ Update success");
          },
          updateFail: (msg) => {
            console.log("❌ Update failed:", msg);
          },
        }
      );

      /**
       * 💾 SAVE VERSION
       */
      OTAHotUpdate.setCurrentVersion(remote.version);

      /**
       * 🔄 APPLY UPDATE
       */
      Alert.alert(
        "Ready",
        "Restart app to apply update",
        [
          {
            text: "Restart Now",
            onPress: () => {
              OTAHotUpdate.resetApp();
            },
          },
        ]
      );

    } else {
      console.log("✅ Already latest version");
    }

  } catch (e) {
    console.log("❌ OTA error:", e);
  }
}

/**
 * 📱 APP
 */
export default function App() {
  useEffect(() => {
    setupOTA();
    checkOTA();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>OTA System Running 🚀</Text>
    </View>
  );
}