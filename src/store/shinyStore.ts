// src/stores/useShinyStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

interface ShinyPokemon {
  id: string; // ID único do registro
  pokemonId: number; // ID do Pokémon
  imgUrl: string; // URL da imagem
  platform: string;
  game: string;
  numOfEncounters: number; // Número de encontros antes de encontrar o shiny
  startedAt: Date | string;
}

interface ShinyStore {
  shinyPokemons: ShinyPokemon[];
  currentHunt: ShinyPokemon | null;
  setCurrentHunt: (pokemon: ShinyPokemon) => void;
  addShinyPokemon: (pokemon: {
    pokemonId: number;
    imgUrl: string;
    numOfEncounters: number;
    game: string;
    platform: string;
    startedAt: Date | string;
  }) => void;
  resetShinyPokemons: () => void;
  resetCurrentHunt: () => void;
}

export const useShinyStore = create<ShinyStore>()(
  persist(
    (set) => ({
      shinyPokemons: [],
      currentHunt: null,
      setCurrentHunt: (pokemon: ShinyPokemon) => set(() => ({ currentHunt: pokemon })),
      addShinyPokemon: ({ pokemonId, imgUrl, numOfEncounters, game, platform, startedAt }) => {
        const newShiny: ShinyPokemon = {
          id: nanoid(),
          pokemonId,
          imgUrl,
          platform,
          game,
          numOfEncounters,
          startedAt,
        };
        set((state) => ({
          shinyPokemons: [...state.shinyPokemons, newShiny],
        }));
      },
      resetShinyPokemons: () => set({ shinyPokemons: [] }),
      resetCurrentHunt: () =>
        set((state) => ({
          currentHunt: state.currentHunt ? { ...state.currentHunt, startedAt: new Date() } : null, // fallback if it's null
        })),
    }),
    {
      name: "shiny-pokemons-storage", // chave no localStorage
    }
  )
);
