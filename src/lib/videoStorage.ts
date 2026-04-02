import { getSupabase } from "./supabase";

const BUCKET = "videos";

export interface VideoAsset {
  id: string;      // storage path
  name: string;    // display name (original filename)
  url: string;     // public URL for playback
  size: number;    // bytes
  createdAt: string;
}

export async function uploadVideo(file: File): Promise<VideoAsset> {
  const supabase = getSupabase();
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return {
    id: data.path,
    name: file.name,
    url: publicUrl,
    size: file.size,
    createdAt: new Date().toISOString(),
  };
}

export async function listVideos(): Promise<VideoAsset[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("", { sortBy: { column: "created_at", order: "desc" } });

  if (error) throw error;

  return (data ?? [])
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => {
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(f.name);
      return {
        id: f.name,
        name: f.metadata?.originalName ?? f.name,
        url: publicUrl,
        size: f.metadata?.size ?? 0,
        createdAt: f.created_at ?? "",
      };
    });
}

export async function deleteVideo(path: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
