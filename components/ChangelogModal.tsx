"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import changelog from "@/lib/data/changelog.json";

interface Entry {
  date: string;
  changes: string[];
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ChangelogModal({ onClose }: { onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  function dismiss() {
    setClosing(true);
    setTimeout(onClose, 150);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entries = changelog as Entry[];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[6vw]"
      onClick={dismiss}
    >
      <div className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`} />
      <div
        className={`relative flex flex-col gap-4 sm:gap-6 bg-white/75 backdrop-blur-[10px] rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[80vh] overflow-hidden ${closing ? "animate-modal-out" : "animate-modal-in"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between shrink-0">
          <h2 className="header-1 text-xl">Changelog</h2>
          <button
            onClick={dismiss}
            className="opacity-100 hover:opacity-40 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/ui/x-icon.png"
              alt="Close"
              width={16}
              height={16}
              style={{ imageRendering: "pixelated" }}
            />
          </button>
        </div>

        <div
          className="-mx-4 sm:-mx-6 border-b"
          style={{ borderColor: "var(--black)" }}
        />

        {entries.length === 0 ? (
          <p className="text-[14px] text-black/40">No entries yet.</p>
        ) : (
          <div className="overflow-y-auto flex flex-col gap-8 normal-case leading-[1.2] max-h-[400px] -mt-4 sm:-mt-6 pt-4 sm:pt-6 -mb-4 sm:-mb-6 pb-4 sm:pb-6 -mr-4 sm:-mr-6 pr-4 sm:pr-6 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black">
            {entries.map((entry, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <span className="text-[12px] font-medium text-black/40 uppercase">
                  {formatDate(entry.date)}
                </span>
                <ul className="flex flex-col gap-2.5">
                  {entry.changes.map((line, j) => (
                    <li key={j} className="text-[14px]">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
