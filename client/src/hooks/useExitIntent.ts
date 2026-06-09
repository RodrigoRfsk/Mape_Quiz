import { useEffect, useRef } from "react";

interface UseExitIntentOptions {
  enabled: boolean;
  onExitIntent: () => void;
}

export const useExitIntent = ({
  enabled,
  onExitIntent,
}: UseExitIntentOptions): void => {
  const triggered = useRef(false);
  const callbackRef = useRef(onExitIntent);
  callbackRef.current = onExitIntent;

  useEffect(() => {
    if (!enabled) return;

    const trigger = () => {
      if (triggered.current) return;
      triggered.current = true;
      callbackRef.current();
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget && event.clientY <= 0) trigger();
    };

    const handlePopState = () => {
      if (triggered.current) return;
      window.history.pushState(null, "", window.location.href);
      trigger();
    };

    window.history.pushState(null, "", window.location.href);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled]);
};
