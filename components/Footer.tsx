"use client";

import { useEffect, useState } from "react";
import { ChangelogModal } from "./ChangelogModal";
import buildMeta from "@/lib/data/buildMeta.json";

function timeAgo(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1mo ago";
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1yr ago" : `${years}yr ago`;
}

export function Footer() {
  const [label, setLabel] = useState("");
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    const buildTime = buildMeta.buildTime;
    function update() {
      setLabel(timeAgo(Date.now() - buildTime));
    }
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <footer className="bottom-0 left-0 right-0 h-8 grid grid-cols-2 items-center px-4 text-xs uppercase text-black bg-[var(--background)] border-t border-black whitespace-nowrap lg:fixed">
        <span>Made with &lt;3 by <a href="https://www.emilynguyen.co/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-800">Emily</a></span>
        <span className="text-right">
          {label && (
            <button
              onClick={() => setShowChangelog(true)}
              className="underline hover:text-zinc-600 transition-colors uppercase"
            >
              Updated {label}
            </button>
          )}
        </span>
      </footer>
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </>
  );
}
