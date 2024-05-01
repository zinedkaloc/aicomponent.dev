import actionWrapper from "@/lib/actions/actionWrapper";
import { getUser } from "@/lib/actions/admin";
import { notFound } from "next/navigation";
import UpdateUser from "@/app/(aicomponent)/admin/users/[id]/UpdateUser";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const user = await actionWrapper(getUser(Number(params.id)));
  if (!user) {
    return notFound();
  }

  return (
    <div>
      <UpdateUser user={user} />
    </div>
  );
}
