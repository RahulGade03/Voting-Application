import React, { useState, useEffect } from "react";
import VoterList from "./VoterList";
import VoterInfoDialog from "./VoterInfoDialog";

const SearchVoter = () => {
  const [voters, setVoters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const votersPerPage = 10;

  useEffect(() => {
    // Load full voter list on mount
    const fetchVoters = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/view-voters?page=1", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        console.log();
        if (data.success) setVoters(data.voters);
      } catch (err) {
        console.error("Failed to fetch voters", err);
      }
    };
    fetchVoters();
  }, []);

  useEffect(() => {
    // Filter voters by name across voters
    const filtered = voters.filter((v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVoters(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, voters]);

  // Pagination calculation
  const indexOfLast = currentPage * votersPerPage;
  const indexOfFirst = indexOfLast - votersPerPage;
  const currentVoters = filteredVoters.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredVoters.length / votersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="ml-64 p-6 max-w-6xl mx-auto"> 
      <input
        type="text"
        placeholder="Search voters by name..."
        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <VoterList
        voters={currentVoters}
        setSelectedVoter={setSelectedVoter}
      />
      <div className="flex justify-between mt-4 text-gray-700">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {selectedVoter && (
        <VoterInfoDialog
          voter={selectedVoter}
          onClose={() => setSelectedVoter(null)}
          onDelete={() => {setSelectedVoter(null);}}
        />
      )}
    </div>
  );
};

export default SearchVoter;
