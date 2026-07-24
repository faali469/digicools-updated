import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ImportJobRow = Database["public"]["Tables"]["import_jobs"]["Row"];

// STUB: records the upload and returns a "sample data loaded" status.
// Real .XER/.MPP/.XLSX/.CSV/.XML parsing is not implemented yet — see
// supabase/migrations/20260723120000_core_schema.sql for the import_jobs shape.
export async function POST(request: Request) {
  const { fileName, fileType } = await request.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("import_jobs")
    .insert({
      file_name: fileName,
      file_type: fileType,
      uploaded_by: user.id,
      status: "Stubbed — sample data loaded",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row = data as ImportJobRow;

  return NextResponse.json({
    id: row.id,
    file: row.file_name,
    type: row.file_type,
    status: row.status,
    uploaded: new Date(row.created_at).toISOString().slice(0, 10),
  });
}
