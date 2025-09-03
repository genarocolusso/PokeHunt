import { useEffect } from "react";
import { useShinyStore } from "../store/shinyStore";
import { TimeAgo } from "../components/TimeAgo";
import { nanoid } from "nanoid";
import { FadeInMotion } from "../animations/fadeIn";
import { useHuntStore } from "../store/pokemonHuntStore";
import { motion } from "motion/react";
import { HuntBar } from "./huntBar";
import { useAuthStore } from "../store/useAuthStore";
import { syncHunts } from "../services/hunt/syncHunt";

const fetchPokemonList = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
  const data = await response.json();
  return data.results.map((pokemon: { name: string; url: string }, index: number) => ({
    id: index + 1,
    name: pokemon.name,
  }));
};

export default function PokemonHunt() {
  const user = useAuthStore((state) => state.user);

  const search = useHuntStore((state) => state.search);
  const increaseInterval = useHuntStore((state) => state.increaseInterval);
  const selectedPlatform = useHuntStore((state) => state.selectedPlatform);
  const selectedGame = useHuntStore((state) => state.selectedGame);
  const findCount = useHuntStore((state) => state.findCount);
  const setFindCount = useHuntStore((state) => state.setFindCount);
  const incrementFindCount = useHuntStore((state) => state.incrementFindCount);
  const setPokemonNumber = useHuntStore((state) => state.setPokemonNumber);
  const pokemonNumber = useHuntStore((state) => state.pokemonNumber);
  const pokemonData = useHuntStore((state) => state.pokemonData);
  const setPokemonData = useHuntStore((state) => state.setPokemonData);
  const setPokemonList = useHuntStore((state) => state.setPokemonList);
  const pokemonList = useHuntStore((state) => state.pokemonList);
  const pokemonName = useHuntStore((state) => state.pokemonName);
  const setPokemonName = useHuntStore((state) => state.setPokemonName);

  const addShinyPokemon = useShinyStore((state) => state.addShinyPokemon);
  const currentHunt = useShinyStore((state) => state.currentHunt);
  const setcurrentHunt = useShinyStore((state) => state.setCurrentHunt);
  const resetcurrentHunt = useShinyStore((state) => state.resetCurrentHunt);
  // Exemplo: adicionar shiny quando encontrar
  const handleFoundShiny = async () => {
    if (pokemonNumber && pokemonImageUrl) {
      addShinyPokemon({
        pokemonId: pokemonNumber,
        imgUrl: pokemonImageUrl,
        pokemonName: pokemonName,
        numOfEncounters: findCount,
        game: selectedGame,
        platform: selectedPlatform,
        startedAt: new Date(),
      });
      setFindCount(0); // resetar contagem após encontrar shiny
      resetcurrentHunt();
      if (user) {
        await syncHunts(user.id);
      }
    }
  };
  const setCurrentHunt = () => {
    if (pokemonNumber && pokemonImageUrl) {
      setcurrentHunt({
        pokemonId: pokemonNumber,
        pokemonName: pokemonName,
        imgUrl: pokemonImageUrl,
        numOfEncounters: findCount,
        game: selectedGame,
        platform: selectedPlatform,
        startedAt: new Date(),
        id: nanoid(),
      });
      setFindCount(0); // resetar contagem após encontrar shiny\
    }
  };

  const countCurrentHunt = () => {
    incrementFindCount();
    if (pokemonNumber && pokemonImageUrl && currentHunt) {
      setcurrentHunt({
        ...currentHunt,
        pokemonId: pokemonNumber,
        pokemonName: pokemonName,
        imgUrl: pokemonImageUrl,
        numOfEncounters: findCount + increaseInterval,
        game: selectedGame,
        platform: selectedPlatform,
      });
    }
  };

  useEffect(() => {
    const loadPokemonList = async () => {
      const list = await fetchPokemonList();
      setPokemonList(list);
    };
    loadPokemonList();
  }, []);

  const handleSetPokemon = () => {
    if (!search) return;

    const isNumber = !isNaN(Number(search));
    if (isNumber) {
      const num = Number(search);
      const found = pokemonList.find((p) => p.id === num);
      if (found) {
        setPokemonNumber(found.id);
        setPokemonName(found.name);
        setPokemonData(found);
        setFindCount(0);
        setCurrentHunt();
      } else {
        alert("whoops no pokemon with this number");
      }
    } else {
      const found = pokemonList.find((p) => p.name.toLowerCase() === search.toLowerCase());
      if (found) {
        setPokemonNumber(found.id);
        setPokemonName(found.name);
        setPokemonData(found);
        setFindCount(0);
        setCurrentHunt();
      } else {
        alert("Pokémon não encontrado com esse nome!");
      }
    }
  };

  const pokemonImageUrl = pokemonNumber
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonNumber}.png`
    : null;

  return (
    <div className="p-8 flex flex-col items-center text-white w-full md:max-w-4xl ">
      <motion.h1
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.9, ease: "easeOut" }}
        className="mb-8 
      bg-linear-to-r from-amber-300 to-sky-400 bg-clip-text  text-xl md:text-5xl font-extrabold text-transparent"
      >
        START YOUR SHINY HUNT
      </motion.h1>
      <HuntBar handleSetPokemon={handleSetPokemon} />

      {/* Pokémon hunt card */}
      <div className="w-full md:max-w-4xl ">
        <FadeInMotion delay={1.3}>
          <div className="bg-gray-800 border-1 border-sky-400/40 animate-border-pulse p-6 rounded-lg flex flex-col items-center ">
            {pokemonData ? (
              <>
                <div className="flex items-center gap-4">
                  <motion.div
                    key={findCount} // 👈 forces re-animation when value changes
                    initial={{ scale: 1, textShadow: "0px 0px 0px rgba(0,0,0,0)" }}
                    animate={{
                      scale: [1, 1.3, 1],
                      textShadow: [
                        "0px 0px 0px rgba(16,185,129,0.0)", // emerald
                        "0px 0px 12px rgba(14,165,233,0.8)", // sky glow
                        "0px 0px 0px rgba(16,185,129,0.0)", // back to none
                      ],
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="text-6xl font-bold mb-2"
                  >
                    {findCount}
                  </motion.div>
                </div>
                <img
                  src={pokemonImageUrl!}
                  alt={`Pokémon ${pokemonNumber}`}
                  className="animate-bounce  w-48 h-48 cursor-pointer scale-120 hover:scale-125 transition"
                  onClick={() => countCurrentHunt()}
                />
                <div className="mt-3 flex gap-2">
                  <span className="bg-black px-3 py-1 rounded-full">{selectedPlatform}</span>
                  <span className="bg-white text-black px-3 py-1 rounded-full">{selectedGame}</span>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {pokemonData.name} (ID: {pokemonData.id})
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {currentHunt && (
                    <div className="flex flex-row gap-2">
                      started at: <TimeAgo date={currentHunt.startedAt} /> ago
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-col md:flex-row gap-2">
                  <button className="bg-black px-4 py-2 rounded-full">Configs</button>

                  <button className="bg-black px-4 py-2 rounded-full">Export all hunts</button>
                  <button className="bg-black px-4 py-2 rounded-full" onClick={() => resetcurrentHunt()}>
                    Reset
                  </button>
                  <button
                    className="bg-violet-500 hover:bg-violet-600 px-4 py-2 rounded-full"
                    onClick={handleFoundShiny}
                  >
                    Mark as found
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-400">Set a Pokémon to start hunting</div>
            )}
          </div>
        </FadeInMotion>
      </div>
    </div>
  );
}
