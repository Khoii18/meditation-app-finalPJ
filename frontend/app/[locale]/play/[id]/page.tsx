"use client";

import { MeditationPlayerUI } from "./components/MeditationPlayerUI";

export default function MeditationPlayer({ params }: { params: { id: string } }) {
  return <MeditationPlayerUI id={params.id} />;
}
