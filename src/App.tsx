import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { useShinyStore } from "./store/shinyStore";
import { FadeInMotion } from "./animations/fadeIn";
import { Link, Outlet } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import { supabase } from "./lib/supabase/client";
import { syncHunts } from "./services/hunt/syncHunt";
import { LoadingSpin, NavBar } from "./components";

function App() {
  const { user, loading } = useAuthStore();
  const shinyPokemons = useShinyStore((state) => state.shinyPokemons);
  const listRef = useRef<HTMLDivElement>(null);
  const [fullWidthTranslateSize, setFullWidthTranslateSize] = useState(0);

  useLayoutEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await syncHunts(user.id);
      }
    };
    init();
  }, []);

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
      {shinyPokemons.length > 0 && (
        <FadeInMotion delay={0.4}>
          <div className="h-16 relative w-full flex justify-end items-center bg-[#1d1d1d] border-b-2 border-violet-400 overflow-hidden">
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
        </FadeInMotion>
      )}

      <nav className="bg-gray-900/80 h-20 w-full py-4 px-6 flex items-center justify-between gap-6 ">
        <h1 className="hidden md:block text-md md:text-3xl font-bold group-hover/scroll:text-amber-200">
          PokeShinyHunt
        </h1>
        <div className="flex items-center justify-between w-full gap-2">
          <NavBar />
          {loading ? (
            <div className="w-5 h-5 border-b-2 border-emerald-300 animate-spin rounded-full"></div>
          ) : (
            <Link
              to={"/login"}
              className="py-2 px-6 border-2 border-emerald-500 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all duration-350 "
            >
              {user ? `Welcome back 👋` : "Login"}
            </Link>
          )}
        </div>
      </nav>
      <div className="w-full flex items-center justify-center">
        <Suspense fallback={<LoadingSpin />}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}

export default App;
