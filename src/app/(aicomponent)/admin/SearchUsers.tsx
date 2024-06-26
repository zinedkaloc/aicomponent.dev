"use client";
import { useQuery } from "@tanstack/react-query";
import actionWrapper from "@/lib/actions/actionWrapper";
import { getUsers } from "@/lib/actions/admin";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserIcon } from "lucide-react";
import useSearchParams from "@/hooks/useSearchParams";
import DeleteUser from "@/app/(aicomponent)/admin/users/[id]/DeleteUser";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function SearchUsers({
  defaultQuery,
  page = 1,
  limit = 100,
}: {
  defaultQuery?: string;
  page?: number;
  limit?: number;
}) {
  const { user: authUser } = useAuth();
  const { set, deleteByKey } = useSearchParams();
  const [_search, setSearch] = useState(defaultQuery ?? "");
  const search = useDebounce(_search, 500);

  const queryKey = ["users-search", search];

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => actionWrapper(getUsers({ page, limit, search })),
  });

  useEffect(() => {
    if (_search) set("q", _search);
    else deleteByKey("q");
  }, [_search]);

  return (
    <div className="container space-y-4 p-4">
      <Input
        type="search"
        placeholder="Search users"
        value={_search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div>
        {isLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : null}

        {data?.pagination.total_records === 0 ? (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
              <UserIcon className="h-12 w-12" />
              <div className="space-y-1 text-center">
                <CardTitle>No User Found</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  It looks like the user you're looking for doesn't exist.
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data?.result.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                {authUser?.id !== user.id && (
                  <DeleteUser onDeleted={refetch} user={user} />
                )}
                <Button size="sm" asChild>
                  <Link
                    className="underline-offset-2 hover:underline"
                    href={`/admin/users/${user.id}`}
                  >
                    View details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
