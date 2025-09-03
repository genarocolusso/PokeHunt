import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

async function fetchHunts(userId: string) {
  if (userId == "") throw new Error("user not found");
  const { data, error } = await supabase
    .from("hunts")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function deleteHunt(huntId: string) {
  const { error } = await supabase.from("hunts").delete().eq("id", huntId);

  if (error) throw error;
  return huntId;
}

export function useHunts(userId: string) {
  return useQuery({
    queryKey: ["hunts", userId],
    queryFn: () => fetchHunts(userId),
    enabled: !!userId, // only fetch if logged in
  });
}

export function useDeleteHunt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHunt,
    onSuccess: (_deletedId, _variables, _context) => {
      // Re-fetch hunts list after deleting one
      queryClient.invalidateQueries({ queryKey: ["hunts"] });
    },
  });
}
