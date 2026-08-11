import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("routes")
    .select("*");

  return (
    <div className="p-10">
      <h1>Error:</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>

      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}