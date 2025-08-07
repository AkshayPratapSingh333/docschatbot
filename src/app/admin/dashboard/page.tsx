import { CustomSession, authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignoutButton from "@/components/signOutButton";

export default async function AdminDashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);

  // Fixed redirect URL syntax and added proper error message
  if (!session || session.user?.role !== "admin") {
    return redirect("/admin/login?error=Unauthorized");
  }

  return (
    <div>
      <h1>Hello Admin</h1>
      <SignoutButton type="Admin" />
    </div>
  );
}