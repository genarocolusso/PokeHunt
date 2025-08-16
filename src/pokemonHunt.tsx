import { useEffect } from "react";
import { useShinyStore } from "./store/shinyStore";
import { TimeAgo } from "./components/TimeAgo";
import { nanoid } from "nanoid";
import { FadeInMotion } from "./animations/fadeIn";
import { useHuntStore } from "./store/pokemonHuntStore";

const fetchPokemonList = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
  const data = await response.json();
  return data.results.map((pokemon: { name: string; url: string }, index: number) => ({
    id: index + 1,
    name: pokemon.name,
  }));
};

const platforms: Record<string, string[]> = {
  "Game Boy": ["Pokémon Red", "Pokémon Blue", "Pokémon Yellow"],
  "Game Boy Color": ["Pokémon Crystal", "Pokémon Gold", "Pokémon Silver"],
  "Game Boy Advance": ["Pokémon Ruby", "Pokémon Sapphire", "Pokémon Emerald", "Pokémon FireRed", "Pokémon LeafGreen"],
  "Nintendo DS": [
    "Pokémon Diamond",
    "Pokémon Pearl",
    "Pokémon Platinum",
    "Pokémon Black",
    "Pokémon White",
    "Pokémon Black 2",
    "Pokémon White 2",
    "Pokémon HeartGold",
    "Pokémon SoulSilver",
  ],
  "Nintendo 3DS": [
    "Pokémon X",
    "Pokémon Y",
    "Pokémon Omega Ruby",
    "Pokémon Alpha Sapphire",
    "Pokémon Sun",
    "Pokémon Moon",
    "Pokémon Ultra Sun",
    "Pokémon Ultra Moon",
  ],
  "Nintendo Switch": [
    "Pokémon Sword",
    "Pokémon Shield",
    "Pokémon Legends: Arceus",
    "Pokémon Scarlet",
    "Pokémon Violet",
    "Pokémon Let's Go Pikachu",
    "Pokémon Let's Go Eevee",
  ],
};

export default function PokemonHunt() {
  const search = useHuntStore((state) => state.search);
  const setSearch = useHuntStore((state) => state.setSearch);
  const increaseInterval = useHuntStore((state) => state.increaseInterval);
  const setSelectedPlatform = useHuntStore((state) => state.setSelectedPlatform);
  const selectedPlatform = useHuntStore((state) => state.selectedPlatform);
  const setSelectedGame = useHuntStore((state) => state.setSelectedGame);
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

  const addShinyPokemon = useShinyStore((state) => state.addShinyPokemon);
  const currentHunt = useShinyStore((state) => state.currentHunt);
  const setcurrentHunt = useShinyStore((state) => state.setCurrentHunt);
  const resetcurrentHunt = useShinyStore((state) => state.resetCurrentHunt);
  // Exemplo: adicionar shiny quando encontrar
  const handleFoundShiny = () => {
    if (pokemonNumber && pokemonImageUrl) {
      addShinyPokemon({
        pokemonId: pokemonNumber,
        imgUrl: pokemonImageUrl,
        numOfEncounters: findCount,
        game: selectedGame,
        platform: selectedPlatform,
        startedAt: new Date(),
      });
      setFindCount(0); // resetar contagem após encontrar shiny
      resetcurrentHunt();
    }
  };
  const setCurrentHunt = () => {
    if (pokemonNumber && pokemonImageUrl) {
      setcurrentHunt({
        pokemonId: pokemonNumber,
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
        imgUrl: pokemonImageUrl,
        numOfEncounters: findCount + increaseInterval,
        game: selectedGame,
        platform: selectedPlatform,
      });
    }
  };
  console.log(currentHunt);
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
        setPokemonData(found);
        setFindCount(0);
        setCurrentHunt();
      } else {
        alert("Pokémon não encontrado com esse número!");
      }
    } else {
      const found = pokemonList.find((p) => p.name.toLowerCase() === search.toLowerCase());
      if (found) {
        setPokemonNumber(found.id);
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
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center text-white">
      {/* Search / selects */}
      <div className="flex w-full max-w-4xl mb-4 gap-2">
        <div className="w-2/4">
          <FadeInMotion delay={0.3}>
            <input
              type="text"
              placeholder="Enter Pokémon name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full bg-gray-100 px-5 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </FadeInMotion>
        </div>
        <FadeInMotion delay={0.8}>
          <select
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setSelectedGame(platforms[e.target.value][0]);
            }}
            className="rounded-full bg-gray-100 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {Object.keys(platforms).map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </FadeInMotion>
        <FadeInMotion delay={1.3}>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="rounded-full bg-gray-100 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {platforms[selectedPlatform].map((game) => (
              <option key={game} value={game}>
                {game}
              </option>
            ))}
          </select>
        </FadeInMotion>
        <button
          onClick={handleSetPokemon}
          className="ml-2 bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-full font-bold"
        >
          SET
        </button>
      </div>

      {/* Pokémon hunt card */}
      <div className="w-full max-w-4xl ">
        <FadeInMotion delay={1.3}>
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center">
            {pokemonData ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-bold mb-2">{findCount}</div>
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
                <div className="mt-4 flex gap-2">
                  <button className="bg-black px-4 py-2 rounded-full">Configs</button>

                  <button className="bg-black px-4 py-2 rounded-full">Export all hunts</button>
                  <button className="bg-black px-4 py-2 rounded-full" onClick={() => resetcurrentHunt()}>
                    Reset
                  </button>
                  <button
                    className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full"
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
