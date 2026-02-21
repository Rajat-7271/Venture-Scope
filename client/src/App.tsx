import "./index.css";
import { companies } from "./data";
import { useState, useEffect } from "react";

type Company = {
  id: number;
  name: string;
  industry: string;
  stage: string;
  location: string;
  website: string;
};

type Enrichment = {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: { text: string; date?: string }[];
  score?: number;
  risk?: string;
  verdict?: string;
  sources?: { label: string; url: string }[];
  timestamp?: string;
};

export default function App() {
  const [activeList, setActiveList] = useState<string | null>(null);
  const [lists, setLists] = useState<Record<string, string[]>>({});
  const [newListName, setNewListName] = useState("");
  const [selectedList, setSelectedList] = useState("");

  const [sortBy, setSortBy] = useState<"name" | "stage">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");

  const [stageFilter, setStageFilter] = useState("All");
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [notes, setNotes] = useState("");
  const [enrichment, setEnrichment] = useState<Enrichment | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 5;
  const [savedCompanies, setSavedCompanies] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      document.body.style.setProperty("--x", `${e.clientX}px`);
      document.body.style.setProperty("--y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedSearches");
      if (saved) setSavedSearches(JSON.parse(saved));
    } catch {
      localStorage.removeItem("savedSearches");
    }
  }, []);

  // ✅ Load saved companies
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedCompanies");
      if (saved) setSavedCompanies(JSON.parse(saved));
    } catch {
      console.warn("Saved companies corrupted");
      localStorage.removeItem("savedCompanies");
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, industryFilter, stageFilter, sortBy, sortOrder, showSavedOnly]);

  // ✅ Load notes
  useEffect(() => {
    if (selectedCompany) {
      const savedNotes = localStorage.getItem(selectedCompany.name);
      setNotes(savedNotes || "");
    }
  }, [selectedCompany]);

  // ✅ Load lists
  useEffect(() => {
    try {
      const savedLists = localStorage.getItem("vcLists");
      if (savedLists) {
        const parsed = JSON.parse(savedLists);
        setLists(parsed);

        const firstList = Object.keys(parsed)[0];
        if (firstList) setSelectedList(firstList);
      }
    } catch {
      console.warn("Lists corrupted");
      localStorage.removeItem("vcLists");
    }
  }, []);

  // ✅ Create List
  const createList = () => {
    if (!newListName.trim()) return;

    if (lists[newListName]) {
      alert("List already exists");
      return;
    }

    const updated = { ...lists, [newListName]: [] };
    setLists(updated);
    setSelectedList(newListName);
    localStorage.setItem("vcLists", JSON.stringify(updated));
    setNewListName("");
  };

  // ✅ Add Company To List
  const addCompanyToList = (listName: string, companyName: string) => {
    if (!listName) return;

    const list = lists[listName] || [];

    if (list.includes(companyName)) {
      alert("Already in list");
      return;
    }

    const updated = {
      ...lists,
      [listName]: [...list, companyName],
    };

    setLists(updated);
    localStorage.setItem("vcLists", JSON.stringify(updated));
  };

  const addToList = () => {
    if (!selectedCompany || !selectedList) return;
    addCompanyToList(selectedList, selectedCompany.name);
  };

  const removeFromList = (listName: string, companyName: string) => {
    const updated = {
      ...lists,
      [listName]: lists[listName].filter((n) => n !== companyName),
    };

    setLists(updated);
    localStorage.setItem("vcLists", JSON.stringify(updated));
  };

  // ✅ DELETE LIST — PASTE HERE
  const deleteList = (listName: string) => {
    const confirmDelete = confirm(`Delete "${listName}" list?`);
    if (!confirmDelete) return;

    const updated = { ...lists };
    delete updated[listName];

    setLists(updated);
    localStorage.setItem("vcLists", JSON.stringify(updated));

    if (selectedList === listName) {
      const firstList = Object.keys(updated)[0] || "";
      setSelectedList(firstList);
    }
  };

  // ✅ RENAME LIST — OPTIONAL (PASTE HERE)
  const renameList = (oldName: string) => {
    const newName = prompt("Enter new list name:");

    if (!newName || !newName.trim()) return;

    if (lists[newName]) {
      alert("List already exists");
      return;
    }

    const updated = { ...lists };
    updated[newName] = updated[oldName];
    delete updated[oldName];

    setLists(updated);
    setSelectedList(newName);
    localStorage.setItem("vcLists", JSON.stringify(updated));
  };

  // ✅ Filter + Sort
  const filteredCompanies = companies
    .filter((company: Company) => {
      const matchesSearch = company.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesIndustry =
        industryFilter === "All" || company.industry === industryFilter;

      const matchesStage =
        stageFilter === "All" || company.stage === stageFilter;

      const matchesSaved =
        !showSavedOnly || savedCompanies.includes(company.name);

      return matchesSearch && matchesIndustry && matchesStage && matchesSaved;
    })
    .sort((a, b) => {
      const comparison =
        sortBy === "name"
          ? a.name.localeCompare(b.name)
          : a.stage.localeCompare(b.stage);

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const startIndex = (currentPage - 1) * companiesPerPage;

  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + companiesPerPage
  );

  const exportListToCSV = (listName: string) => {
    const companyNames = lists[listName];

    if (!companyNames.length) {
      setShowEmptyModal(true);
      return;
    }

    const header = ["Name", "Industry", "Stage", "Location", "Website"];

    const rows = companyNames.map((name) => {
      const company = companies.find((c) => c.name === name);

      return [
        company?.name,
        company?.industry,
        company?.stage,
        company?.location,
        company?.website,
      ].join(",");
    });

    const csvContent = [header.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${listName}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const saveCurrentSearch = () => {
    const newSearch = {
      id: Date.now(),
      search,
      industryFilter,
      stageFilter,
      sortBy,
      sortOrder,
    };

    const updated = [...savedSearches, newSearch];

    setSavedSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));
  };

  const applySearch = (s: any) => {
    setSearch(s.search);
    setIndustryFilter(s.industryFilter);
    setStageFilter(s.stageFilter);
    setSortBy(s.sortBy);
    setSortOrder(s.sortOrder);
    setActiveList(null);
  };

  const removeSavedSearch = (id: number) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));
  };

  const exportListToJSON = (listName: string) => {
    const companyNames = lists[listName];

    if (!companyNames.length) {
      setShowEmptyModal(true);
      return;
    }

    const data = companyNames.map((name) => {
      const company = companies.find((c) => c.name === name);
      return company;
    });

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${listName}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>
          VentureScope <span className="beta">Beta</span>
        </h2>

        <nav>
          <button onClick={() => {
            setSelectedCompany(null);
            setActiveList(null);
            setShowSavedOnly(false);
          }}>
            🏢 Companies
          </button>

          <button onClick={() => {
            setSelectedCompany(null);
            setActiveList("LISTS");
          }}>
            📂 Lists
          </button>

          <button onClick={() => {
            setShowSavedOnly(true);
            setSelectedCompany(null);
            setActiveList(null);
          }}>
            ⭐ Saved
          </button>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-content">
            <div className="search-box">
              <span>🔎</span>
              <input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="theme-toggle"
              onClick={() => document.body.classList.toggle("dark")}
            >
              🌗
            </button>
          </div>
        </header>

        <section className="content">

          {selectedCompany ? (

            /* 🧾 PROFILE VIEW */
            <div className="details-page">

              <button
                className="back-btn"
                onClick={() => setSelectedCompany(null)}
              >
                ← Back
              </button>

              <div className="company-header">

                <div className="company-title">
                  <h1>{selectedCompany.name}</h1>
                  <a href={selectedCompany.website} target="_blank">
                    🌐 Visit Website
                  </a>
                </div>

                <div className="profile-card">
                  <div>
                    <span className="label">Industry</span>
                    <span>{selectedCompany.industry}</span>
                  </div>

                  <div>
                    <span className="label">Stage</span>
                    <span>{selectedCompany.stage}</span>
                  </div>

                  <div>
                    <span className="label">Location</span>
                    <span>{selectedCompany.location}</span>
                  </div>
                </div>

              </div>

              <button
                className={`save-btn ${
                  savedCompanies.includes(selectedCompany.name) ? "saved" : ""
                }`}
                onClick={() => {
                  const updated = savedCompanies.includes(selectedCompany.name)
                    ? savedCompanies.filter((n) => n !== selectedCompany.name)
                    : [...savedCompanies, selectedCompany.name];

                  setSavedCompanies(updated);
                  localStorage.setItem("savedCompanies", JSON.stringify(updated));
                }}
              >
                {savedCompanies.includes(selectedCompany.name)
                  ? "✅ Saved"
                  : "⭐ Save Company"}
              </button>

              <div className="workspace-card">
              <h3>Research Workspace</h3>

              <div className="lists-section">
                <h3>Lists</h3>

                <div className="create-list-row">
                  <input
                    placeholder="New list name..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                  />
                  <button onClick={createList}>Create</button>
                </div>

                {Object.keys(lists).length > 0 && (
                  <div className="add-to-list-row">
                    <select
                      value={selectedList}
                      onChange={(e) => setSelectedList(e.target.value)}
                    >
                      {Object.keys(lists).map((listName) => (
                        <option key={listName} value={listName}>
                          {listName}
                        </option>
                      ))}
                    </select>

                    <button onClick={addToList}>
                      ➕ Add to List
                    </button>
                  </div>
                )}
              </div>

              <div className="notes">
                <h3>Notes</h3>
                <textarea
                  placeholder="Write your notes about this company..."
                  value={notes}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNotes(value);
                    localStorage.setItem(selectedCompany.name, value);
                  }}
                />
              </div>

              <button
                className="enrich-btn"
                disabled={loading}
                  onClick={async () => {
                    if (!selectedCompany) return;

                    try {
                      setLoading(true);
                      setEnrichment(null);

                          const res = await fetch("/api/enrich", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: selectedCompany.name,
                            website: selectedCompany.website,
                          }),
                      });

                      const data = await res.json();

                      setEnrichment({
                        ...data,
                        signals: (data.signals || []).map((s: any) =>
                          typeof s === "string"
                            ? { text: s }
                            : s
                        ),
                        timestamp: new Date().toLocaleString(),
                      });
                    } catch (err) {
                      console.error("Enrichment failed", err);
                      alert("Failed to enrich company");
                    } finally {
                      setLoading(false);
                    }
                  }} 
              >
                {loading ? "Enriching..." : "✨ Enrich"}
              </button>
                
                </div>

              {loading && (
                <p className="loading-text">🔄 Fetching intelligence...</p>
              )}

              {/* ✨ Enrichment Card INSIDE */}
              {enrichment && (
                <div className="enrichment-card">

                  {enrichment.score != null && (
                    <div className="score-card">
                      <h3>Investment Score</h3>
                      <p className="score">{enrichment.score} / 100</p>
                      <p><strong>Risk:</strong> {enrichment.risk}</p>
                      <p><strong>Verdict:</strong> {enrichment.verdict}</p>
                    </div>
                  )}

                  {enrichment.timestamp && (
                    <p className="timestamp">
                      ⏱ Last Enriched: {enrichment.timestamp}
                    </p>
                  )}

                  <h3>Summary</h3>
                  <p>{enrichment.summary}</p>

                  <h3>What they do</h3>
                  <ul>
                    {enrichment.whatTheyDo?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  <h3>Keywords</h3>
                  <div className="keywords">
                    {enrichment.keywords?.map((kw, i) => (
                      <span key={i}>{kw}</span>
                    ))}
                  </div>

                  <h3>Signals</h3>

                  <div className="timeline">
                    {enrichment.signals?.map((sig, i) => (
                      <div key={i} className="timeline-item">
                        <div className="timeline-dot" />
                        <div className="timeline-content">
                          {sig.date && <span className="timeline-date">{sig.date}</span>}
                          <p>{sig.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {enrichment.sources && enrichment.sources.length > 0 && (
                    <>
                      <h3>Sources</h3>
                      <ul className="sources">
                        {enrichment.sources.map((src, i) => (
                          <li key={i}>
                            <a href={src.url} target="_blank" rel="noopener noreferrer">
                              {src.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                </div>
              )}

          </div>
          
          ) : activeList === "LISTS" ? (

            /* 📂 LISTS VIEW */
            <div className="lists-page">
              <h1>My Lists</h1>

              {Object.keys(lists).length === 0 ? (
                <p>No lists created yet</p>
              ) : (
                Object.keys(lists).map((listName) => (
                  <div key={listName} className="list-card">
                    <h3>{listName}</h3>

                    <div className="list-actions">
                      <button onClick={() => exportListToCSV(listName)}>⬇ CSV</button>
                      <button onClick={() => exportListToJSON(listName)}>⬇ JSON</button>
                      <button onClick={() => renameList(listName)}>✏ Rename</button>
                      <button onClick={() => deleteList(listName)}>🗑 Delete</button>
                    </div>

                    <ul>
                      {lists[listName].map((company) => (
                        <li key={company}>
                          {company}
                          <button onClick={() => removeFromList(listName, company)}>
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>

          ) : (

            /* 🏢 COMPANIES VIEW */
            <>
              <h1>Companies</h1>

              <div className="filters">

                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>AI</option>
                  <option>Fintech</option>
                  <option>Productivity</option>
                </select>

                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Early Stage</option>
                  <option>Growth</option>
                  <option>Late Stage</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "name" | "stage")
                  }
                >
                  <option value="name">Sort by Name</option>
                  <option value="stage">Sort by Stage</option>
                </select>

                <button
                  className={`sort-order ${sortOrder}`}
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? "⬆ Ascending" : "⬇ Descending"}
                </button>

                {/* 🔥 ADD HERE */}
                <button onClick={saveCurrentSearch}>
                  💾 Save Search
                </button>

              </div>

              <div className="saved-searches">
                <h3>Saved Searches</h3>

                {savedSearches.length === 0 ? (
                  <p className="empty-state">No saved searches yet</p>
                ) : (
                  savedSearches.map((s) => (
                    <div key={s.id} className="saved-search-card">

                      <span>
                        🔎 "{s.search || "All"}"
                        {" • "}
                        {s.industryFilter}
                        {" • "}
                        {s.stageFilter}
                      </span>

                      <div className="saved-search-actions">
                        <button onClick={() => applySearch(s)}>
                          Apply
                        </button>

                        <button onClick={() => removeSavedSearch(s.id)}>
                          ❌
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

              {filteredCompanies.length === 0 && (
                <p className="empty-state">
                  😕 No companies match your filters
                </p>
              )}
              
              <table className="companies-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Industry</th>
                    <th>Stage</th>
                    <th>Location</th>
                    <th>List</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCompanies.map((company) => (
                    <tr
                      key={company.id}
                      onClick={() => {
                        setSelectedCompany(company);
                        setEnrichment(null);
                      }}
                    >
                      <td>{company.name}</td>
                      <td>{company.industry}</td>
                      <td>{company.stage}</td>
                      <td>{company.location}</td>

                      <td onClick={(e) => e.stopPropagation()}>
                        {Object.keys(lists).length > 0 ? (
                          <select
                            defaultValue=""
                            onChange={(e) =>
                              addCompanyToList(e.target.value, company.name)
                            }
                          >
                            <option value="" disabled>
                              ➕ Add
                            </option>
                            {Object.keys(lists).map((listName) => (
                              <option key={listName} value={listName}>
                                {listName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ← Prev
                </button>

                <span>
                  Page {currentPage} of {totalPages || 1}
                </span>

                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next →
                </button>
              </div>
            </>
          )}

        </section>

        {showEmptyModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Empty List</h3>
              <p>This list doesn’t contain any companies yet.</p>

              <button onClick={() => setShowEmptyModal(false)}>
                OK
              </button>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}