"use client";


export function Footer() {
  return (
    <footer className="bottom-0 left-0 right-0 h-8 grid grid-cols-2 items-center px-4 text-xs uppercase text-black bg-[var(--background)] border-t border-black whitespace-nowrap lg:fixed">
      <span>Made with &lt;3 by <a href="https://www.emilynguyen.co/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-800">Emily</a></span>
      <span className="text-right">Last updated Jun 6 2026</span>
    </footer>
  );
}
