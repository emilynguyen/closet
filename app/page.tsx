import { CharacterPanel } from "@/components/character/CharacterPanel";
import { Inventory } from "@/components/character/Inventory";

export default function Home() {

  return (
    <main className="flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-1 gap-[6vw] p-[6vw] pb-[calc(6vw+2rem)] lg:min-h-[calc(100vh-2rem)] lg:overflow-hidden">
      {/* Character — first on mobile, right column on md+ */}
      <div className="h-[80vh] min-h-[400px] max-h-[600px] lg:h-auto lg:min-h-0 lg:max-h-none lg:order-2">
        <CharacterPanel />
      </div>

      {/* Inventory — second on mobile, left column on md+ */}
      <div className="flex flex-col gap-8 bg-white/75 backdrop-blur-[10px] rounded-lg p-4 sm:p-6 lg:my-auto lg:order-1">
        <h1
          className="header-1 shrink-0"
          style={{ fontSize: "clamp(24px, 6vw, 40px)" }}
        >
          Inventory
        </h1>
        <Inventory />
      </div>
    </main>
  );
}
