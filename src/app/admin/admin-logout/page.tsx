"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut();
      window.location.href = "/admin-login";
    }

    logout();
  }, []);

  return <div>Logging out...</div>;
}