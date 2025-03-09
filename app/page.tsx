import LinkForm from "@/components/link-form";
import LinkList from "@/components/link-list";
import { SearchBar } from "@/components/search-bar";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Link Saver</h1>
      <div className="grid gap-8 md:grid-cols-[350px_1fr]">
        <div className="space-y-6">
          <LinkForm />
        </div>
        <div className="space-y-6">
          <SearchBar />
          <LinkList />
        </div>
      </div>
    </main>
  );
}
