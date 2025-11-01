import React from "react";

const VoterList = ({ voters, setSelectedVoter }) => {
  return (
    <ul className="divide-y divide-gray-300">
      {voters?.map((voter) => (
        <li
          key={voter?._id}
          className="flex items-center justify-between py-3"
        >
          <div>
            <p className="font-medium text-gray-900">{voter?.name}</p>
            <p className="text-gray-600 text-sm">{voter?.emailId}</p>
          </div>
          <button
            onClick={() => setSelectedVoter(voter)}
            className="px-3 py-1 text-white bg-slate-900 rounded hover:bg-teal-600"
          >
            View Info
          </button>
        </li>
      ))}
    </ul>
  );
};

export default VoterList;