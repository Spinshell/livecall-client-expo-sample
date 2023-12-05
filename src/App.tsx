import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import CloseIcon from "./CloseIcon";
import GlobeIcon from "./GlobeIcon";
import { WebViewEvent } from "react-native-webview/lib/WebViewTypes";

export default function App() {
  const [link, setLink] = useState(`${process.env.EXPO_PUBLIC_LINK}`);
  const [openModal, setOpenModal] = useState(false);
  const [receivedEvents, setReceivedEvents] = useState<{ type: string }[]>([]);

  const changeText = (text: string) => {
    setLink(text);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const makeCall = () => {
    setOpenModal(true);
  };

  // forward message event listens from window.postMessage -> window.ReactNativeWebView
  const injectedJavascript = `
  window.addEventListener('message', function(e) {
    try {
      var data = JSON.parse(e.data);
      if (data.application === 'livecall') {
        window.ReactNativeWebView.postMessage(e.data);
      }
    } catch (e) {
      console.error(e)
    }
  });
  `;

  const onMessageWebView = (event: WebViewEvent) => {
    try {
      // @ts-ignore
      const data = JSON.parse(event.nativeEvent.data);
      setReceivedEvents(receivedEvents.concat(data));
      alert(data.type);
      if (data.type === "close_room") {
        setOpenModal(false);
      }
    } catch (e) {
      console.error("Received webview message fail", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.heading}>
        <GlobeIcon size={28} />
        <Text style={styles.headingText}>LiveCall Client App</Text>
      </View>

      <View style={styles.input}>
        <TextInput value={link} onChangeText={changeText} />
      </View>

      <Pressable onPress={makeCall}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Make a call</Text>
        </View>
      </Pressable>

      {receivedEvents.length > 0 && (
        <View style={styles.eventList}>
          {receivedEvents.map((event, i) => (
            <View key={`${event.type}-${i}`} style={styles.eventItem}>
              <Text>event: {event.type}</Text>
            </View>
          ))}
        </View>
      )}

      <Modal visible={openModal}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalTitle}>
            <Pressable onPress={closeModal}>
              <View style={styles.closeButton}>
                <CloseIcon size={32} color="black" />
              </View>
            </Pressable>
          </View>
          <WebView
            originWhitelist={["*"]}
            injectedJavaScript={injectedJavascript}
            onMessage={(event) => onMessageWebView(event)}
            source={{ uri: link }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
  },
  headingText: {
    fontSize: 20,
  },
  input: {
    width: "80%",
    marginBottom: 16,
    padding: 10,
    paddingRight: 16,
    paddingLeft: 16,
    borderWidth: 1,
    borderRadius: 6,
  },
  button: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#037bfed4",
    borderRadius: 4,
    backgroundColor: "#037bfe",
    padding: 8,
    paddingRight: 12,
    paddingLeft: 12,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  modal: {
    flex: 1,
  },
  modalTitle: {
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#d2d2d2",
  },
  closeButton: {
    padding: 10,
  },
  eventList: {
    width: "40%",
    borderWidth: 1,
    borderColor: "#d2d2d2",
    padding: 4,
    paddingRight: 8,
    paddingLeft: 8,
  },
  eventItem: {
    flexDirection: "row",
  },
});
