import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import RNFS from "react-native-fs";
import OTAHotUpdate from "react-native-ota-hot-update";

const BUNDLE_NAME =
  Platform.OS === "android" ? "index.android.bundle" : "main.jsbundle";
const GITHUB_RAW = "https://raw.githubusercontent.com/fatimatuzzohra313/Otachecking/pla/ota";

export default function App() {
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    (async () => {
      try {
        const verRes = await fetch(`${GITHUB_RAW}/version.json`);
        if (!verRes.ok) return;
        const remote = await verRes.json();
        const localVersion = await OTAHotUpdate.getCurrentVersion();
        if (localVersion !== remote.version) {
          const destPath = `${RNFS.DocumentDirectoryPath}/${BUNDLE_NAME}`;
          const result = await RNFS.downloadFile({
            fromUrl: remote.bundleUrl,
            toFile: destPath,
          }).promise;
          if (result.statusCode === 200) {
            const success = await OTAHotUpdate.setupExactBundlePath(destPath);
            if (success) {
              await OTAHotUpdate.setCurrentVersion(remote.version);
              OTAHotUpdate.resetApp();
            }
          }
        }
      } catch (_) {}
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A120B" />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>F</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.userName}>Fatima</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceCurrency}>$</Text>
          </View>
          <Text style={styles.balanceAmount}>12,450.00</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceStat}>
              <Text style={styles.statArrow}>↑</Text>
              <Text style={styles.statText}>+2.5% this week</Text>
            </View>
            <View style={styles.balanceStat}>
              <View style={styles.statDot} />
              <Text style={styles.statLabel}>Savings</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {[
            { emoji: "💳", label: "Payments", bg: "#FEF5E7" },
            { emoji: "💰", label: "Top Up", bg: "#FEF9E7" },
            { emoji: "📊", label: "Reports", bg: "#FDF2E9" },
            { emoji: "⚙️", label: "Settings", bg: "#F5EEF8" },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.actionBtn}>
              <View style={[styles.actionIcon, { backgroundColor: item.bg }]}>
                <Text style={styles.actionEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.servicesGrid}>
          {[
            { emoji: "📱", title: "Mobile Recharge", bg: "#FEF5E7" },
            { emoji: "💡", title: "Electricity Bill", bg: "#FEF9E7" },
            { emoji: "📺", title: "TV Subscription", bg: "#FDF2E9" },
            { emoji: "🌐", title: "Internet Bundle", bg: "#F5EEF8" },
            { emoji: "🏦", title: "Bank Transfer", bg: "#E8F8F5" },
            { emoji: "🎮", title: "Gaming Cards", bg: "#FDEDEC" },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.serviceCard}>
              <View style={[styles.serviceIcon, { backgroundColor: item.bg }]}>
                <Text style={styles.serviceEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.serviceTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          {[
            { emoji: "📤", title: "Sent to Ahmed", amount: "-$50.00", time: "2 hours ago", bg: "#FDEDEC" },
            { emoji: "📥", title: "Received from Sara", amount: "+$200.00", time: "5 hours ago", bg: "#E8F8F5" },
            { emoji: "💳", title: "Payment Successful", amount: "-$25.00", time: "Yesterday", bg: "#FEF5E7" },
          ].map((item, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: item.bg }]}>
                <Text style={styles.activityEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              <Text style={[
                styles.activityAmount,
                { color: item.amount.startsWith("+") ? "#27AE60" : "#C0392B" }
              ]}>
                {item.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { icon: "🏠", label: "Home" },
          { icon: "📋", label: "Orders" },
          { icon: "💳", label: "Pay" },
          { icon: "👤", label: "Profile" },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.navItem}>
            <Text style={[styles.navIcon, i === 0 && styles.navIconActive]}>{item.icon}</Text>
            <Text style={[styles.navLabel, i === 0 && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF0",
  },
  header: {
    backgroundColor: "#1A120B",
    paddingTop: Platform.OS === "android" ? 48 : 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D4A853",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#1A120B",
    fontSize: 20,
    fontWeight: "800",
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
  },
  greeting: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "500",
  },
  userName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  notifIcon: {
    fontSize: 18,
  },
  notifBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D4A853",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: "#D4A853",
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    shadowColor: "#D4A853",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    color: "rgba(26,18,11,0.65)",
    fontSize: 14,
    fontWeight: "600",
  },
  balanceCurrency: {
    color: "rgba(26,18,11,0.45)",
    fontSize: 16,
    fontWeight: "700",
  },
  balanceAmount: {
    color: "#1A120B",
    fontSize: 38,
    fontWeight: "800",
    marginTop: 8,
    letterSpacing: -1,
  },
  balanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(26,18,11,0.12)",
  },
  balanceStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statArrow: {
    color: "#1A120B",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 4,
  },
  statText: {
    color: "rgba(26,18,11,0.7)",
    fontSize: 12,
    fontWeight: "600",
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1A120B",
    marginRight: 6,
  },
  statLabel: {
    color: "rgba(26,18,11,0.6)",
    fontSize: 12,
    fontWeight: "500",
  },

  // Quick Actions
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D1810",
    marginTop: 24,
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    alignItems: "center",
    width: "22%",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 12,
    color: "#5D4037",
    fontWeight: "600",
    marginTop: 8,
  },

  // Services Grid
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  serviceCard: {
    width: "30.5%",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5E6CC",
    shadowColor: "#D4A853",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceEmoji: {
    fontSize: 20,
  },
  serviceTitle: {
    fontSize: 11,
    color: "#4A3728",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },

  // Activity
  activityCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F5E6CC",
    shadowColor: "#D4A853",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5EDE0",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D1810",
  },
  activityTime: {
    fontSize: 12,
    color: "#A09080",
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingTop: 10,
    paddingBottom: Platform.OS === "android" ? 10 : 28,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#F5EDE0",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navIcon: {
    fontSize: 22,
    opacity: 0.35,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 11,
    color: "#A09080",
    fontWeight: "500",
    marginTop: 4,
  },
  navLabelActive: {
    color: "#D4A853",
    fontWeight: "700",
  },
});
