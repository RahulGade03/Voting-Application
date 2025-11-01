import React, { useState, useEffect } from "react";
import VoterList from "./VoterList";
import VoterInfoDialog from "./VoterInfoDialog";
import { toast } from "react-toastify";

const SearchVoter = () => {
  const [voters, setVoters] = useState([]);
  const [foundVoters, setFoundVoters] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load full voter list on mount
    const fetchVoters = async () => {
      try {
        const res = await fetch(`https://votingapplicationbackend.vercel.app/admin/view-voters?page=${currentPage}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        if (data?.success) {
          setVoters(data?.voters);
          setTotalPages(data?.totalPages);
        } else {
          throw new Error(data?.error);
        }
      } catch (err) {
        toast.error(err?.message);
        console.error("Failed to fetch voters", err);
      }
    };
    fetchVoters();
  }, [currentPage]);

  useEffect(() => {
    // Filter voters by name across voters
    const filtered = voters?.filter((v) =>
      v?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVoters(filtered);
    // setCurrentPage(1); // Reset to first page on search
    setFoundVoters(null);
  }, [searchTerm, voters]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchTerm.trim().length > 0) {
        const res = await fetch(`https://votingapplicationbackend.vercel.app/admin/view-voter-byname?searchString=${searchTerm}`, {
          method: 'GET',
          credentials: "include",
        })
        const data = await res.json();
        console.log(data);
        if (data?.success) {
          setFoundVoters(data?.voters);
        }
        else {
          throw new Error(data?.error);
        }
      }
    } catch (error) {
      toast.error(error?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ml-64 p-6 max-w-6xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search voters by name..."
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-black text-white rounded-md min-w-fit mb-4 px-4 py-2" onClick={handleSearch}>
          {loading ? "Please wait..." : "Search Global"}
        </button>
      </div>
      <VoterList
        voters={foundVoters ? foundVoters : filteredVoters}
        setSelectedVoter={setSelectedVoter}
      />
      {!foundVoters && <div className="flex justify-between mt-4 text-gray-700">
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
      </div>}
      {selectedVoter && (
        <VoterInfoDialog
          voter={selectedVoter}
          onClose={() => setSelectedVoter(null)}
          onDelete={() => { setSelectedVoter(null); }}
        />
      )}
    </div>
  );
};

export default SearchVoter;