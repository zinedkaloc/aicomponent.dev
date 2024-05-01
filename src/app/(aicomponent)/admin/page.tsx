import SearchUsers from "@/app/(aicomponent)/admin/SearchUsers";

interface Props {
  searchParams: {
    q: string;
    page: number;
    limit: number;
  };
}

export default async function Page({ searchParams }: Props) {
  return (
    <div>
      <SearchUsers
        page={searchParams.page}
        limit={searchParams.limit}
        defaultQuery={searchParams.q}
      />
    </div>
  );
}
