import { useEffect, useRef, useState } from "react";
import "./App.css";
import PokemonHunt from "./pokemonHunt";
import { useShinyStore } from "./store/shinyStore";

function App() {
  const shinyPokemons = useShinyStore((state) => state.shinyPokemons);
  const listRef = useRef<HTMLDivElement>(null);
  const [fullWidthTranslateSize, setFullWidthTranslateSize] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      setFullWidthTranslateSize(listRef.current.offsetWidth);
    }
  }, [shinyPokemons.length]);
  5;

  const windWidth = window.innerWidth;
  const hasScroll = fullWidthTranslateSize > windWidth;

  return (
    <>
      <nav className="bg-[#2c2c2c] h-20 w-full py-4 px-6 flex items-center">
        <h1 className="text-3xl font-bold group-hover/scroll:text-amber-200">PokeHunt</h1>
      </nav>

      <div className="h-16 relative w-full flex justify-end items-center bg-[#1d1d1d] overflow-hidden">
        {/* First copy */}
        <div ref={listRef} className={`${hasScroll ? "animate-infinite-scroll" : ""} flex absolute group/scroll`}>
          {shinyPokemons.map((poke) => {
            return (
              <div
                key={`first-${poke.id}`}
                className="min-w-[147px] flex items-center gap-3 px-2 odd:bg-zinc-500/10 bg-zinc-500/15
                 
                "
              >
                <img className="object-fit h-16 w-16" src={poke.imgUrl} />
                <p className="text-2xl font-bold">{poke.numOfEncounters}</p>
              </div>
            );
          })}
        </div>

        {/* Second copy (only render once we know the width) */}
        {fullWidthTranslateSize > 0 && (
          <div
            className={`${hasScroll ? "animate-infinite-scroll" : ""} flex absolute group/scroll`}
            style={{ right: `-${fullWidthTranslateSize}px` }}
          >
            {shinyPokemons.map((poke) => {
              return (
                <div
                  key={`first-${poke.id}`}
                  className="min-w-[147px] flex items-center gap-3 px-2 odd:bg-zinc-500/10 bg-zinc-500/15
                   "
                >
                  <img className="object-fit h-16 w-16" src={poke.imgUrl} />
                  <p className="text-2xl font-bold">{poke.numOfEncounters}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PokemonHunt />
    </>
  );
}

export default App;
