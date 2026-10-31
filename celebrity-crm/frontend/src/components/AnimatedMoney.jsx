import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { formatMoney } from "../utils/format";

export default function AnimatedMoney({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <>{formatMoney(display)}</>;
}
