"use client";
import Generate from "@/components/Generate";
import { useState } from "react";

export default function Chat() {
  const [key, setKey] = useState(() => new Date().getTime());

  function reset() {
    setKey(new Date().getTime());
  }

  return <Generate key={key} reset={reset} />;
}
