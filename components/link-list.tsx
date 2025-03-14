"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { deleteLink, getLinks } from "@/lib/actions";
// import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import EditLinkDialog from "./edit-link-dialog";
import type { Link } from "@/lib/types";

export default function LinkList() {
  // const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getLinks();
        setLinks(data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to fetch links",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  // Listen for search term changes from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    setSearchTerm(query);
  }, []); //Corrected dependency

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      try {
        await deleteLink(id);
        setLinks(links.filter((link) => link._id !== id));
        toast({
          title: "Success",
          description: "Link deleted successfully",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to delete link",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
  };

  const handleEditComplete = (updatedLink: Link) => {
    setLinks(
      links.map((link) => (link._id === updatedLink._id ? updatedLink : link))
    );
    setEditingLink(null);
  };

  // Filter links based on search term
  const filteredLinks = links.filter((link) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      link.title.toLowerCase().includes(searchLower) ||
      link.description?.toLowerCase().includes(searchLower) ||
      link.url.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredLinks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          {searchTerm ? (
            <p className="text-muted-foreground">
              No links found matching `{searchTerm}`
            </p>
          ) : (
            <p className="text-muted-foreground">
              No links saved yet. Add your first link!
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredLinks.map((link) => (
        <Card key={link._id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{link.title}</h3>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                >
                  {link.url.length > 50
                    ? `${link.url.substring(0, 50)}...`
                    : link.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
                {link.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {link.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Added: {new Date(link.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(link)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(link._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {editingLink && (
        <EditLinkDialog
          link={editingLink}
          onClose={() => setEditingLink(null)}
          onSave={handleEditComplete}
        />
      )}
    </div>
  );
}
