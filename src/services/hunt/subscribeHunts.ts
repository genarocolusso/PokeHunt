import { supabase } from "../../lib/supabase/client";
import { useShinyStore } from "../../store/shinyStore";

export const subscribeToHunts = (userId: string) => {
  const channel = supabase
    .channel("hunts-changes")
    .on(
      "postgres_changes",
      {
        event: "*", // INSERT, UPDATE, DELETE
        schema: "public",
        table: "hunts",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("🔔 Realtime update:", payload);

        const { eventType, new: newRow, old } = payload;

        useShinyStore.setState((state) => {
          let updated = [...state.shinyPokemons];

          if (eventType === "INSERT") {
            // evita duplicata
            if (!updated.find((h) => h.id === newRow.id)) {
              updated.push({
                id: newRow.id,
                pokemonId: newRow.pokemon_id,
                pokemonName: newRow.pokemon_name,
                imgUrl: newRow.img_url,
                platform: newRow.platform,
                game: newRow.game,
                numOfEncounters: newRow.num_of_encounters,
                startedAt: newRow.started_at,
              });
            }
          }

          if (eventType === "UPDATE") {
            updated = updated.map((h) =>
              h.id === newRow.id
                ? {
                    ...h,
                    numOfEncounters: newRow.num_of_encounters,
                    game: newRow.game,
                    platform: newRow.platform,
                    imgUrl: newRow.img_url,
                    startedAt: newRow.started_at,
                  }
                : h
            );
          }

          if (eventType === "DELETE") {
            updated = updated.filter((h) => h.id !== old.id);
          }

          return { shinyPokemons: updated };
        });
      }
    )
    .subscribe();

  return channel;
};
