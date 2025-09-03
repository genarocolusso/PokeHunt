import { useState } from "react";

import { useAuthStore } from "../store/useAuthStore";
import { useDeleteHunt, useHunts } from "../services/hunt/Hunts";
import { LoadingSpin } from "../components";
import { AnimatePresence, motion } from "motion/react";
import { useShinyStore } from "../store/shinyStore";

export const HuntCollection = () => {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading } = useHunts(user?.id || "");
  const { mutate: deleteHunt, isPending: mutationPending } = useDeleteHunt();
  const removePokemon = useShinyStore((state) => state.removePokemon);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    console.log(id);
    setDeletingId(id);
    try {
      await deleteHunt(id); // or whatever your delete logic is
    } finally {
      removePokemon(id);
    }
  };

  return (
    <div className="w-full md:max-w-6xl px-4">
      <h1 className="text-6xl mt-4 mb-8 "> Shiny Collection</h1>
      {isLoading ? (
        <div className="full-w h-60 flex items-center justify-center">
          <LoadingSpin />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {data &&
              data.map((pokemon) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }} // This defines the exit animation
                  key={pokemon.id}
                  className=" group relative hover:scale-102 transition-all duration-400 bg-gray-500/30  overflow-hidden  shadow-xl p-4 rounded-[8px]"
                >
                  <div className="flex gap-4">
                    <img src={pokemon.img_url} className="w-40 h-40" />
                    <div>
                      <div className="text-3xl capitalize">{pokemon.pokemon_name}</div>
                      <div className="text-xl text-gray-400">id#{pokemon.pokemon_id}</div>
                      <div className="text-[14px] text-gray-200 font-bold">Encounters {pokemon.num_of_encounters}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex gap-2">
                      <span className="bg-black px-3 py-1 rounded-full">{pokemon.platform}</span>
                      <span className="bg-white text-black px-3 py-1 rounded-full">{pokemon.game}</span>
                    </div>
                  </div>
                  <div className="group-hover:visible group-hover:opacity-100 opacity-0 backdrop-blur-xs transition-all duration-400 invisible absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-gray-300/70">
                    <div className="actions h-full flex gap-4 items-center justify-center">
                      <button
                        disabled={(mutationPending || isLoading) && deletingId == pokemon.id}
                        onClick={() => handleDelete(pokemon.id)}
                        className="px-6 py-2 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-600 hover:border-transparent hover:text-white focus:outline-none transition-all duration-200 disabled:opacity-50"
                      >
                        {deletingId == pokemon.id && mutationPending ? <LoadingSpin color="emerald" /> : "Remove ❌"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
