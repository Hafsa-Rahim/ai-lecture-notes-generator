import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [subject, setSubject] = useState("");
const [topic, setTopic] = useState("");
const [level, setLevel] = useState("BS Software Engineering");
const [language, setLanguage] = useState("English");
const [notesType, setNotesType] = useState("Detailed Notes");

const [generatedNotes, setGeneratedNotes] = useState("");
const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const generateNotes = async () => {

  if (!subject.trim() || !topic.trim()) {
    alert("Please enter Subject and Lecture Topic.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch("/api/generate-notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  userId: user?.User_ID,
  subject,
  topic,
  level,
  language,
  notesType,
}),
    });

    const data = await response.json();

    if (data.success) {
      setGeneratedNotes(data.notes);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  const initials =
    user?.Full_Name
      ?.split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">
            AI Notes Generator
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-semibold"
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
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-lg"
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
            Dashboard
          </h2>

          <div className="flex items-center gap-3">

            <div className="text-right">

              <div className="font-semibold">
                {user?.Full_Name || "Guest"}
              </div>

              <div className="text-sm text-gray-500">
                {user?.Role || "User"}
              </div>

            </div>

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {initials}
            </div>

          </div>

        </header>

        <div className="flex-1 p-8">

          <h1 className="text-3xl font-bold">
            Welcome back, {user?.Full_Name || "User"} 👋
          </h1>

          <p className="text-gray-500 mt-2">
            {user?.University}
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8">

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Notes Generated
              </h3>

              <p className="text-3xl font-bold mt-3">
                0
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Favorites
              </h3>

              <p className="text-3xl font-bold mt-3">
                0
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                AI Requests
              </h3>

              <p className="text-3xl font-bold mt-3">
                0
              </p>
            </div>

          </div>

         <div className="bg-white rounded-xl shadow mt-8 p-8">

  <h2 className="text-2xl font-bold text-blue-600 mb-6">
    🤖 AI Lecture Notes Generator
  </h2>

  <div className="grid md:grid-cols-2 gap-5">

    <div>
      <label className="font-medium">Subject</label>
      <input
type="text"
placeholder="e.g Cloud Computing"
value={subject}
onChange={(e)=>setSubject(e.target.value)}
className="w-full mt-2 border rounded-lg p-3"
/>
    </div>

    <div>
      <label className="font-medium">Lecture Topic</label>
      <input
type="text"
placeholder="e.g IBM Cloud Services"
value={topic}
onChange={(e)=>setTopic(e.target.value)}
className="w-full mt-2 border rounded-lg p-3"
/>
    </div>

    <div>
      <label className="font-medium">Academic Level</label>

      <input
  type="text"
  placeholder="e.g. BS Software Engineering"
  value={level}
  onChange={(e) => setLevel(e.target.value)}
  className="w-full mt-2 border rounded-lg p-3"
/>
    </div>

    <div>
      <label className="font-medium">Language</label>

      <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className="w-full mt-2 border rounded-lg p-3"
>
  <option>English</option>
  <option>Urdu</option>
</select>
    </div>

    <div>
      <label className="font-medium">Notes Type</label>

      <select
  value={notesType}
  onChange={(e) => setNotesType(e.target.value)}
  className="w-full mt-2 border rounded-lg p-3"
>
  <option>Detailed Notes</option>
  <option>Exam Notes</option>
  <option>Quick Revision</option>
  <option>Bullet Points</option>
</select>
    </div>

  </div>

  <button
  type="button"
  onClick={generateNotes}
  disabled={loading}
  className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-400"
>
  {loading ? "Generating..." : "✨ Generate Notes"}
</button>

  <div className="mt-10 border rounded-xl p-6 bg-slate-50">

    <h3 className="text-xl font-bold mb-4">
      Generated Notes
    </h3>

    <pre className="text-gray-700 whitespace-pre-wrap font-sans">
  {generatedNotes || "AI generated notes will appear here..."}
</pre>

  </div>

</div>

</div>

</main>

</div>
  );
}