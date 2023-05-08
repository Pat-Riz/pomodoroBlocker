import { OffscreenMessage } from "../types";

const OFFSCREEN_DOCUMENT_PATH = "/offscreen.html";

export async function playAudioInOffscreenDocument(
  source: string,
  volume: number
) {
  // Create an offscreen document if one doesn't exist yet
  if (!(await hasDocument())) {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
      justification: "Need to play background sound",
    });
  }
  // Now that we have an offscreen document, we can dispatch the
  // message.
  console.log("Sending message to offscreen");
  chrome.runtime.sendMessage<OffscreenMessage>({
    target: "offscreen",
    action: "playSound",
    source,
    volume,
  });
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}

async function hasDocument() {
  // Check all windows controlled by the service worker if one of them is the offscreen document
  //@ts-ignore
  const matchedClients = await clients.matchAll();
  for (const client of matchedClients) {
    if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
      return true;
    }
  }
  return false;
}
