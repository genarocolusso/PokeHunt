import { supabase } from "../../lib/supabase/client";
import { useShinyStore } from "../../store/shinyStore";

export const syncHunts = async (userId: string) => {
  const localHunts = useShinyStore.getState().shinyPokemons;

  const { data: remoteHunts, error: errorHunts } = await supabase.from("hunts").select("*").eq("user_id", userId);

  if (errorHunts) {
    console.error("Erro ao buscar hunts  ", errorHunts);
    return;
  }

  // 3. Normalizar remote para o formato do Zustand
  const normalizedRemote = (remoteHunts || []).map((row) => ({
    id: row.id,
    pokemonId: row.pokemon_id,
    pokemonName: row.pokemon_name,
    imgUrl: row.img_url,
    platform: row.platform,
    game: row.game,
    numOfEncounters: row.num_of_encounters,
    startedAt: row.started_at,
  }));

  // 4. Mesclar sem duplicar (preferindo hunts locais mais recentes)
  const merged = [...normalizedRemote];

  for (const local of localHunts) {
    const exists = merged.find((m) => m.id === local.id);
    if (!exists) {
      merged.push(local);
    }
  }

  // 5. Atualizar Zustand com a lista final
  useShinyStore.setState({ shinyPokemons: merged });

  // 6. Subir tudo para Supabase (garante que o banco tenha o mesmo estado final)
  const rows = merged.map((p) => ({
    id: p.id,
    user_id: userId,
    pokemon_id: p.pokemonId,
    pokemon_name: p.pokemonName || "",
    img_url: p.imgUrl,
    platform: p.platform,
    game: p.game,
    num_of_encounters: p.numOfEncounters,
    started_at: p.startedAt,
  }));

  const { error: upsertError } = await supabase.from("hunts").upsert(rows);
  if (upsertError) console.error("Erro ao salvar hunts:", upsertError);
};
