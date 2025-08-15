import { useState, useEffect } from "react";
import { useShinyStore } from "./store/shinyStore";

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
  const [search, setSearch] = useState("");
  const [increaseInterval, setIncreaseInterva] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("Game Boy");
  const [selectedGame, setSelectedGame] = useState<string>(platforms["Game Boy"][0]);
  const [pokemonNumber, setPokemonNumber] = useState<number | null>(null);
  const [findCount, setFindCount] = useState<number>(0);
  const [pokemonData, setPokemonData] = useState<{ id: number; name: string } | null>(null);
  const [pokemonList, setPokemonList] = useState<{ id: number; name: string }[]>([]);

  const addShinyPokemon = useShinyStore((state) => state.addShinyPokemon);
  const shinyPokemons = useShinyStore((state) => state.shinyPokemons);
  const resetShinyPokemons = useShinyStore((state) => state.resetShinyPokemons);

  // Exemplo: adicionar shiny quando encontrar
  const handleFoundShiny = () => {
    if (pokemonNumber && pokemonImageUrl) {
      addShinyPokemon({
        pokemonId: pokemonNumber,
        imgUrl: pokemonImageUrl,
        numOfEncounters: findCount,
        game: selectedGame,
        platform: selectedPlatform,
      });
      setFindCount(0); // resetar contagem após encontrar shiny
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
        setPokemonData(found);
        setFindCount(0);
      } else {
        alert("Pokémon não encontrado com esse número!");
      }
    } else {
      const found = pokemonList.find((p) => p.name.toLowerCase() === search.toLowerCase());
      if (found) {
        setPokemonNumber(found.id);
        setPokemonData(found);
        setFindCount(0);
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
        <input
          type="text"
          placeholder="Enter Pokémon name or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full bg-gray-100 px-5 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

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

        <button
          onClick={handleSetPokemon}
          className="ml-2 bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-full font-bold"
        >
          SET
        </button>
      </div>

      {/* Pokémon hunt card */}
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl flex flex-col items-center">
        {pokemonData ? (
          <>
            <div className="flex items-center gap-4">
              <div className="text-6xl font-bold mb-2">{findCount}</div>
            </div>
            <img
              src={pokemonImageUrl!}
              alt={`Pokémon ${pokemonNumber}`}
              className="w-48 h-48 cursor-pointer hover:scale-105 transition"
              onClick={() => setFindCount((prev) => prev + increaseInterval)}
            />
            <div className="mt-3 flex gap-2">
              <span className="bg-black px-3 py-1 rounded-full">{selectedPlatform}</span>
              <span className="bg-white text-black px-3 py-1 rounded-full">{selectedGame}</span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {pokemonData.name} (ID: {pokemonData.id})
            </div>
            <div className="mt-2 text-sm text-gray-400">started at: {new Date().toLocaleString()}</div>
            <div className="mt-4 flex gap-2">
              <button className="bg-black px-4 py-2 rounded-full">Configs</button>

              <button className="bg-black px-4 py-2 rounded-full">Export all hunts</button>
              <button className="bg-black px-4 py-2 rounded-full" onClick={() => setFindCount(0)}>
                Reset
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full" onClick={handleFoundShiny}>
                Mark as found
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-400">Set a Pokémon to start hunting</div>
        )}
      </div>
    </div>
  );
}
