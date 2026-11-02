"use client";

import SendMessageButton from "@/app/(dashboardLayout)/admin-dashboard/chat/(component)/sendMessage";
import { useEffect, useState } from "react";

const ContactWithAdmin = () => {
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    const getAdmin = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/super-admin/for-send/message`,
      );

      const data = await res.json();

      console.log("admin response:", data);

      // ✅ correct path
      const id = data?.data?.data?.[0]?.id;

      setAdminId(id);
    };

    getAdmin();
  }, []);

  if (!adminId) return null;

  return (
    <div>
      <SendMessageButton receiverId={adminId} userType="admin" />
    </div>
  );
};

export default ContactWithAdmin;
