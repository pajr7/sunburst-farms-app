"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The old "what are you sharing" chooser now lives inside the composer.
export default function NewRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/post");
  }, [router]);
  return null;
}
