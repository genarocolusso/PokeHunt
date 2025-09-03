import { FadeInMotion } from "../animations/fadeIn";
import { useHuntStore } from "../store/pokemonHuntStore";
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
export interface HuntBarProps {
  handleSetPokemon: () => void;
}
export const HuntBar = ({ handleSetPokemon }: HuntBarProps) => {
  const search = useHuntStore((state) => state.search);
  const setSearch = useHuntStore((state) => state.setSearch);
  const setSelectedPlatform = useHuntStore((state) => state.setSelectedPlatform);
  const selectedPlatform = useHuntStore((state) => state.selectedPlatform);
  const setSelectedGame = useHuntStore((state) => state.setSelectedGame);
  const selectedGame = useHuntStore((state) => state.selectedGame);

  return (
    <div className="flex md:flex-row flex-col w-full md:max-w-4xl mb-4 gap-2">
      <div className="w-full md:w-min-2/4">
        <FadeInMotion delay={0.3} classprop="w-full">
          <input
            type="text"
            placeholder="Enter Pokémon name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full bg-gray-100 px-5 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </FadeInMotion>
      </div>
      <FadeInMotion delay={0.8} classprop="w-full">
        <select
          value={selectedPlatform}
          onChange={(e) => {
            setSelectedPlatform(e.target.value);
            setSelectedGame(platforms[e.target.value][0]);
          }}
          className="w-full rounded-full bg-gray-100 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          {Object.keys(platforms).map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </FadeInMotion>
      <FadeInMotion delay={1.3} classprop="w-full">
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="w-full rounded-full bg-gray-100 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          {platforms[selectedPlatform].map((game) => (
            <option key={game} value={game}>
              {game}
            </option>
          ))}
        </select>
      </FadeInMotion>
      <FadeInMotion delay={1.8} classprop="xs:w-full">
        <button
          onClick={handleSetPokemon}
          className="w-full px-6 py-2 border-2 border-sky-600 text-sky-600 font-semibold rounded-full hover:bg-gradient-to-r hover:from-sky-600 hover:to-blue-600 hover:text-white focus:outline-none    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          SET
        </button>
      </FadeInMotion>
    </div>
  );
};
