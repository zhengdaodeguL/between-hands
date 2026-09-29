import { UIKitDocument, UIKitMLAsset } from "@iwsdk/core";
import { Container, Text } from "@pmndrs/uikit";
import { Button, ButtonLabel } from "@pmndrs/uikit-horizon";
import { colors } from "../theme/tokens";

/** Build the six spatial controls directly with the SDK's UIKit components. */
export function createMenu() {
  const root = new Container({
    flexDirection: "row",
    gap: 8,
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    width: 720,
  });

  for (const [id, text] of [
    ["begin", "Begin / Next"],
    ["pause", "Pause / Resume"],
    ["reset", "Reset"],
    ["center", "Recenter"],
    ["sound", "Sound"],
    ["exit", "Exit VR"],
  ]) {
    const button = new Button({ id, height: 48, flexGrow: 1 });
    const label = new ButtonLabel();
    label.add(new Text({ text, alignSelf: "stretch", flexGrow: 1 }));
    button.add(label);
    root.add(button);
  }

  return new UIKitMLAsset("between-hands-menu", new UIKitDocument(root));
}
