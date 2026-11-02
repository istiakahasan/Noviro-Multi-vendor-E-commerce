// import { Ticket } from "@/types/global";
// import { useState } from "react";

// const SearchBar: React.FC<{ placeholder: string; onSearch: (value: string) => void }> = ({ placeholder, onSearch }) => (
//   <input
//     type="text"
//     placeholder={placeholder}
//     className="border p-2 rounded"
//     onChange={(e) => onSearch(e.target.value)}
//   />
// );

// const FilterButton: React.FC<{ label: string }> = ({ label }) => (
//   <button className="bg-gray-200 px-4 py-2 rounded">{label}</button>
// );

// const StatusDropdown: React.FC<{ label: string }> = ({ label }) => (
//   <select className="border px-2 py-1 rounded">
//     <option>{label}</option>
//     <option>Resolved</option>
//     <option>Pending</option>
//     <option>Open</option>
//     <option>Escalated</option>
//   </select>
// );

// const TicketsTable: React.FC<{ tickets: Ticket[]; onView: (ticket: Ticket) => void }> = ({ tickets, onView }) => (
//   <table className="w-full border-collapse border">
//     <thead>
//       <tr>
//         <th className="border p-2">ID</th>
//         <th className="border p-2">Summary</th>
//         <th className="border p-2">Status</th>
//         <th className="border p-2">Action</th>
//       </tr>
//     </thead>
//     <tbody>
//       {tickets.map((ticket) => (
//         <tr key={ticket.id}>
//           <td className="border p-2">{ticket.id}</td>
//           <td className="border p-2">{ticket.summary}</td>
//           <td className="border p-2">{ticket.status}</td>
//           <td className="border p-2">
//             <button className="text-blue-500" onClick={() => onView(ticket)}>View</button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );



// // src/components/Pages/ComplaintTicketsPage.tsx



// const ComplaintTicketsPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState<string>('');

//   const ticketData: Ticket[] = [
//     { id: '#TX-9045', type: '#ORO-10045', customer: '#ORO-10045', seller: '#ORO-10045', summary: 'Luffy', lastUpdated: 'World Government', status: 'Resolved' },
//     { id: '#TX-9046', type: '#ORO-10046', customer: '#ORO-10046', seller: '#ORO-10046', summary: 'Nami', lastUpdated: 'World Government', status: 'Pending' },
//     { id: '#TX-9047', type: '#ORO-10047', customer: '#ORO-10047', seller: '#ORO-10047', summary: 'Sanji', lastUpdated: 'World Government', status: 'Open' },
//     { id: '#TX-9048', type: '#ORO-10048', customer: '#ORO-10048', seller: '#ORO-10048', summary: 'Zoro', lastUpdated: 'World Government', status: 'Resolved' },
//     { id: '#TX-9049', type: '#ORO-10049', customer: '#ORO-10049', seller: '#ORO-10049', summary: 'Usopp', lastUpdated: 'World Government', status: 'Pending' },
//     { id: '#TX-9050', type: '#ORO-10050', customer: '#ORO-10050', seller: '#ORO-10050', summary: 'Robin', lastUpdated: 'World Government', status: 'Open' },
//     { id: '#TX-9051', type: '#ORO-10051', customer: '#ORO-10051', seller: '#ORO-10051', summary: 'Chopper', lastUpdated: 'World Government', status: 'Escalated' },
//     { id: '#TX-9052', type: '#ORO-10052', customer: '#ORO-10052', seller: '#ORO-10052', summary: 'Franky', lastUpdated: 'World Government', status: 'Resolved' },
//     { id: '#TX-9053', type: '#ORO-10053', customer: '#ORO-10053', seller: '#ORO-10053', summary: 'Brook', lastUpdated: 'World Government', status: 'Open' },
//   ];

//   const filteredTickets = ticketData.filter((ticket) =>
//     ticket.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleView = (ticket: Ticket): void => {
//     console.log('Viewing ticket:', ticket);
//   };

//   return (
//     <div>
//       <div className="flex gap-4 mb-6">
//         <SearchBar
//           placeholder="Search by name or email..."
//           onSearch={setSearchTerm}
//         />
       
//         <FilterButton label="Filters" />
//         <StatusDropdown label="All Status" />
//       </div>
//       <TicketsTable tickets={filteredTickets} onView={handleView} />
//     </div>
//   );
// };

// export default ComplaintTicketsPage;


"use client";

import { Ticket } from "@/types/global";
import { useState } from "react";
import { MoreVertical } from "lucide-react";

const SearchBar: React.FC<{ placeholder: string; onSearch: (value: string) => void }> = ({ placeholder, onSearch }) => (
  <div className="relative">
    <input
      type="text"
      placeholder={placeholder}
      className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      onChange={(e) => onSearch(e.target.value)}
    />
    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
);

const FilterButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
    {label}
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

const StatusDropdown: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="border border-gray-300 px-4 py-2 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option>All Status</option>
    <option>Resolved</option>
    <option>Pending</option>
    <option>Open</option>
    <option>Escalated</option>
  </select>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (s: string) => {
    switch (s) {
      case 'Resolved': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'Pending': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
      case 'Open': return { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' };
      case 'Escalated': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };
  const config = getStatusConfig(status);
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
};

const ActionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
    <MoreVertical className="h-4 w-4" />
  </button>
);

const TicketsTable: React.FC<{ 
  tickets: Ticket[]; 
  selectedTickets: string[]; 
  onSelectAll: () => void; 
  onSelect: (id: string, checked: boolean) => void; 
  onView: (ticket: Ticket) => void 
}> = ({ tickets, selectedTickets, onSelectAll, onSelect, onView }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <input
              type="checkbox"
              checked={selectedTickets.length === tickets.length && tickets.length > 0}
              onChange={(e) => onSelectAll()}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Summary</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <tr key={ticket.id} className="hover:bg-gray-50">
            <td className="px-4 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                checked={selectedTickets.includes(ticket.id)}
                onChange={(e) => onSelect(ticket.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.type}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.customer}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.seller}</td>
            <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{ticket.summary}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.lastUpdated}</td>
            <td className="px-4 py-4 whitespace-nowrap">
              <StatusBadge status={ticket.status} />
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
              <ActionButton onClick={() => onView(ticket)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// src/components/Pages/ComplaintTicketsPage.tsx
const ComplaintTicketsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false); // For future modal, but toggle for now

  const ticketData: Ticket[] = [
    { id: '#TX-9045', type: '#ORO-10045', customer: '#ORO-10045', seller: '#ORO-10045', summary: 'Luffy', lastUpdated: 'World Government', status: 'Resolved' },
    { id: '#TX-9046', type: '#ORO-10046', customer: '#ORO-10046', seller: '#ORO-10046', summary: 'Luffy', lastUpdated: 'World Government', status: 'Pending' },
    { id: '#TX-9047', type: '#ORO-10047', customer: '#ORO-10047', seller: '#ORO-10047', summary: 'Luffy', lastUpdated: 'World Government', status: 'Open' },
    { id: '#TX-9048', type: '#ORO-10048', customer: '#ORO-10048', seller: '#ORO-10048', summary: 'Luffy', lastUpdated: 'World Government', status: 'Resolved' },
    { id: '#TX-9049', type: '#ORO-10049', customer: '#ORO-10049', seller: '#ORO-10049', summary: 'Luffy', lastUpdated: 'World Government', status: 'Pending' },
    { id: '#TX-9050', type: '#ORO-10050', customer: '#ORO-10050', seller: '#ORO-10050', summary: 'Luffy', lastUpdated: 'World Government', status: 'Open' },
    { id: '#TX-9051', type: '#ORO-10051', customer: '#ORO-10051', seller: '#ORO-10051', summary: 'Luffy', lastUpdated: 'World Government', status: 'Escalated' },
    { id: '#TX-9052', type: '#ORO-10052', customer: '#ORO-10052', seller: '#ORO-10052', summary: 'Luffy', lastUpdated: 'World Government', status: 'Resolved' },
    { id: '#TX-9053', type: '#ORO-10053', customer: '#ORO-10053', seller: '#ORO-10053', summary: 'Luffy', lastUpdated: 'World Government', status: 'Open' },
  ];

  const filteredTickets = ticketData.filter((ticket) => {
    const matchesSearch = ticket.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (ticket: Ticket): void => {
    console.log('Viewing ticket:', ticket);
    // TODO: Open modal or navigate
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, id]);
    } else {
      setSelectedTickets(selectedTickets.filter(s => s !== id));
    }
  };

  const handleFiltersClick = () => {
    setShowFilters(!showFilters);
    console.log('Filters clicked'); // TODO: Open filters modal
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <SearchBar
          placeholder="Search by ticket id or summary..."
          onSearch={setSearchTerm}
        />
        <div className="flex gap-4 items-center">
          <FilterButton label="Filters" onClick={handleFiltersClick} />
          <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>
      <TicketsTable 
        tickets={filteredTickets} 
        selectedTickets={selectedTickets}
        onSelectAll={handleSelectAll}
        onSelect={handleSelect}
        onView={handleView} 
      />
    </div>
  );
};

export default ComplaintTicketsPage;