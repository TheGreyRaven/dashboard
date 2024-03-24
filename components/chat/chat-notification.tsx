import useLocalStorage from "react-localstorage-hook";

import { IconVolume, IconVolumeOff } from "@tabler/icons-react";

import { Button } from "../ui/button";

const SoundNotification = () => {
  const [audioMuted, setAudioMuted] = useLocalStorage(
    "chat-notification",
    true
  );
  return (
    <Button
      variant="outline"
      size="icon"
      disabled
      onClick={() => setAudioMuted(!audioMuted)}
    >
      {audioMuted ? (
        <IconVolume className="h-4 w-4" />
      ) : (
        <IconVolumeOff className="h-4 w-4" />
      )}
    </Button>
  );
};

export { SoundNotification };
