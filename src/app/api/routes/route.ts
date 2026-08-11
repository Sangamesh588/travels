import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("routes")
      .select("*");

    console.log("Routes Data:", data);
    console.log("Routes Error:", error);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("API Error:", err);

    return NextResponse.json(
      { error: err.message || "Unknown Error" },
      { status: 500 }
    );
  }
}