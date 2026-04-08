"use client";

import { use } from "react";
import { MeditationPlayerUI } from "./components/MeditationPlayerUI";

export default function MeditationPlayer({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <MeditationPlayerUI id={resolvedParams.id} />;
}
