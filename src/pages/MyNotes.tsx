import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MyNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        const response = await fetch(
          `/api/notes/${encodeURIComponent(parsedUser.User_ID)}`
        );

        const data = await response.json();

        if (data.success) {
          setNotes(data.notes);
        } else {
          alert(data.message || "Unable to load notes.");
        }
      } catch (error) {
        console.error("Load Notes Error:", error);
        alert("Something went wrong while loading notes.");
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  const initials =
    user?.Full_Name
      ?.split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase() || "U";
const toggleFavorite = async (noteId: string, currentFavorite: boolean) => {
  try {
    const response = await fetch(
      `/api/notes/${noteId}/favorite`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favorite: !currentFavorite,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? { ...note, Favorite: !currentFavorite }
            : note
        )
      );
    } else {
      alert(data.message || "Unable to update favorite.");
    }
  } catch (error) {
    console.error("Favorite Error:", error);
    alert("Something went wrong while updating favorite.");
  }
};
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">
            AI Notes Generator
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">

          <a
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-lg"
          >
            Dashboard
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-lg"
          >
            AI Assistant
          </a>

          <a
            href="/my-notes"
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-semibold"
          >
            My Notes
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-lg"
          >
            Favorites
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-lg"
          >
            History
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-lg"
          >
            Profile
          </a>

        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">

        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

          <h2 className="text-lg font-semibold">
            My Notes
          </h2>

          <div className="flex items-center gap-3">

            <div className="text-right">
              <div className="font-semibold">
                {user?.Full_Name || "User"}
              </div>

              <div className="text-sm text-gray-500">
                {user?.Role || ""}
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {initials}
            </div>

          </div>

        </header>

        <div className="flex-1 p-8">

          <h1 className="text-3xl font-bold">
            My Notes
          </h1>

          <p className="text-gray-500 mt-2">
            Your AI generated lecture notes
          </p>

          {loading ? (
            <p className="mt-8">
              Loading notes...
            </p>
          ) : notes.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <p className="text-gray-500">
                No notes found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 mt-8">

              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-xl shadow p-6"
                >

                  <div className="flex items-center justify-between gap-4">
  <h2 className="text-xl font-bold text-blue-600">
    {note.Lecture_Topic}
  </h2>

  <button
    type="button"
    onClick={() =>
      toggleFavorite(note.id, Boolean(note.Favorite))
    }
    className="text-2xl"
    title={
      note.Favorite
        ? "Remove from Favorites"
        : "Add to Favorites"
    }
  >
    {note.Favorite ? "⭐" : "☆"}
  </button>
</div>
                  <div className="grid md:grid-cols-2 gap-2 mt-4 text-sm">

                    <p>
                      <strong>Subject:</strong> {note.Subject}
                    </p>

                    <p>
                      <strong>Academic Level:</strong>{" "}
                      {note.Academic_Level}
                    </p>

                    <p>
                      <strong>Notes Type:</strong> {note.Notes_Type}
                    </p>

                    <p>
                      <strong>Language:</strong> {note.Language}
                    </p>

                  </div>

                  <div className="border-t mt-5 pt-5">

                    <div className="text-gray-700 leading-7">
  <ReactMarkdown>
    {String(note.AI_Response || "")}
  </ReactMarkdown>
</div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  );
}