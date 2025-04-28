import React, { useState, useEffect } from 'react';
import data from './data.json';

export default function JsonTable() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setRecords(data);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = (id) => {
    const filtered = records.filter((record) => record.id !== id);
    setRecords(filtered);
  };

  const filteredRecords = records.filter((record) => {
    return Object.values(record).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
        className="mb-4 p-2 border rounded w-full"
      />
      <table className="w-full border border-collapse">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.id}>
              <td className="border p-2">{record.id}</td>
              <td className="border p-2">{record.firstName}</td>
              <td className="border p-2">{record.lastName}</td>
              <td className="border p-2">{record.email}</td>
              <td className="border p-2">{record.phoneNumber}</td>
              <td className="border p-2">{record.gender}</td>
              <td className="border p-2">{record.address}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(record.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}