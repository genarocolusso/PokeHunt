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
}

interface ShinyStore {
  shinyPokemons: ShinyPokemon[];
  addShinyPokemon: (pokemon: {
    pokemonId: number;
    imgUrl: string;
    numOfEncounters: number;
    game: string;
    platform: string;
  }) => void;
  resetShinyPokemons: () => void;
}

export const useShinyStore = create<ShinyStore>()(
  persist(
    (set) => ({
      shinyPokemons: [],

      addShinyPokemon: ({ pokemonId, imgUrl, numOfEncounters, game, platform }) => {
        const newShiny: ShinyPokemon = {
          id: nanoid(),
          pokemonId,
          imgUrl,
          platform,
          game,
          numOfEncounters,
        };

        set((state) => ({
          shinyPokemons: [...state.shinyPokemons, newShiny],
        }));
      },

      resetShinyPokemons: () => set({ shinyPokemons: [] }),
    }),
    {
      name: "shiny-pokemons-storage", // chave no localStorage
    }
  )
);
