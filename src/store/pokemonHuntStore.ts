// src/stores/useHuntStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PokemonData {
  id: number;
  name: string;
}

interface HuntStore {
  search: string;
  setSearch: (search: string) => void;

  increaseInterval: number; // constant but stored in state if you ever want to change
  setIncreaseInterval: (interval: number) => void;

  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;

  selectedGame: string;
  setSelectedGame: (game: string) => void;

  pokemonName: string;
  setPokemonName: (name: string) => void;
  pokemonNumber: number | null;
  setPokemonNumber: (num: number | null) => void;

  findCount: number;
  setFindCount: (count: number) => void;
  incrementFindCount: () => void;

  pokemonData: PokemonData | null;
  setPokemonData: (data: PokemonData | null) => void;

  pokemonList: PokemonData[];
  setPokemonList: (list: PokemonData[]) => void;

  resetHunt: () => void;
}

export const useHuntStore = create<HuntStore>()(
  persist(
    (set) => ({
      search: "",
      setSearch: (search) => set({ search }),

      increaseInterval: 1,
      setIncreaseInterval: (interval) => set({ increaseInterval: interval }),

      selectedPlatform: "Game Boy",
      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

      selectedGame: "", // you can initialize later
      setSelectedGame: (game) => set({ selectedGame: game }),

      pokemonNumber: null,
      setPokemonNumber: (num) => set({ pokemonNumber: num }),
      pokemonName: "",
      setPokemonName: (name) => set({ pokemonName: name }),
      findCount: 0,
      setFindCount: (count) => set({ findCount: count }),
      incrementFindCount: () => set((state) => ({ findCount: state.findCount + state.increaseInterval })),

      pokemonData: null,
      setPokemonData: (data) => set({ pokemonData: data }),

      pokemonList: [],
      setPokemonList: (list) => set({ pokemonList: list }),

      resetHunt: () =>
        set({
          search: "",
          increaseInterval: 1,
          selectedPlatform: "Game Boy",
          selectedGame: "",
          pokemonNumber: null,
          pokemonName: "",
          findCount: 0,
          pokemonData: null,
          pokemonList: [],
        }),
    }),
    {
      name: "hunt-storage", // persists in localStorage
    }
  )
);
