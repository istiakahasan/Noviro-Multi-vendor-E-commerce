// // src/app/(dashboardLayout)/admin-dashboard/platform-settings/components/RolesPermissions.tsx

// import React, { useState } from 'react';
// import { Edit2, Trash2 } from 'lucide-react';
// import { Role } from '@/types/global';

// const RolesPermissions: React.FC = () => {
//   const [roles, setRoles] = useState<Role[]>([
//     {
//       id: '1',
//       name: 'Super Admin',
//       permissions: ['All Access'],
//       description: 'Full platform control',
//     },
//     {
//       id: '2',
//       name: 'Admin',
//       permissions: ['Manage Products', 'Manage Categories'],
//       description: 'Content-related tasks',
//     },
//     {
//       id: '3',
//       name: 'Super Agent',
//       permissions: ['Customer Support', 'Ticket Management'],
//       description: 'Customer service',
//     },
//   ]);

//   return (
//     <div>
//       <h2 className="text-lg font-semibold text-gray-900 mb-6">Existing Roles</h2>

//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
//                 ROLE NAME
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
//                 Permissions
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
//                 Description
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {roles.map((role) => (
//               <tr key={role.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 text-sm text-gray-900">{role.name}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">
//                   {role.permissions.join(', ')}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{role.description}</td>
//                 <td className="px-6 py-4">
//                   <div className="flex gap-3">
//                     <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
//                       <Edit2 size={16} />
//                     </button>
//                     <button className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RolesPermissions;



// src/app/(dashboardLayout)/admin-dashboard/platform-settings/components/RolesPermissions.tsx

import React, { useState } from 'react';
import { Edit2, Trash2, X } from 'lucide-react';
import { Role } from '@/types/global';

const RolesPermissions: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Admin',
      permissions: ['All Access'],
      description: 'Full platform control',
    },
    {
      id: '2',
      name: 'Admin',
      permissions: ['Manage Products', 'Manage Categories'],
      description: 'Content-related tasks',
    },
    {
      id: '3',
      name: 'Super Agent',
      permissions: ['Customer Support', 'Ticket Management'],
      description: 'Customer service',
    },
  ]);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editForm, setEditForm] = useState({ name: '', permissions: 'All Access', description: '' });

  const permissionOptions = [
    { value: 'All Access', label: 'All Access' },
    { value: 'Manage Products, Manage Categories', label: 'Manage Products, Manage Categories' },
    { value: 'Customer Support, Ticket Management', label: 'Customer Support, Ticket Management' },
  ];

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setEditForm({ 
      name: role.name, 
      permissions: role.permissions.join(', '), 
      description: role.description 
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (field: 'name' | 'permissions' | 'description', value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole && editForm.name.trim() && editForm.permissions && editForm.description.trim()) {
      const updatedRole: Role = {
        ...editingRole,
        name: editForm.name,
        permissions: editForm.permissions.split(', '),
        description: editForm.description,
      };
      setRoles(prev => prev.map(r => r.id === editingRole.id ? updatedRole : r));
      setIsEditModalOpen(false);
      setEditingRole(null);
      console.log('Updated Role:', updatedRole);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(prev => prev.filter(r => r.id !== id));
      console.log('Deleted Role ID:', id);
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setEditingRole(null);
    console.log('Changes cancelled');
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { roles };
    console.log('Roles & Permissions Form Data:', formData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Roles & Permissions</h2>

      {/* Existing Roles Table */}
      <h3 className="text-base font-medium text-gray-700 mb-4">Existing Roles</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ROLE NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {role.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                  {role.permissions.join(', ')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {role.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(role)}
                      className="p-1 text-blue-600 hover:text-blue-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="p-1 text-red-600 hover:text-red-900 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Commented Add New Role Button and Modal */}
      {/* <button
        onClick={openAddModal}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Plus size={16} />
        Add New Role
      </button> */}

      {/* Buttons */}
      <div className="flex justify-start space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-white text-gray-700 px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveAll}
          className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Commented Add Modal */}
      {/* {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Role</h3>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddRole}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => handleAddChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter role name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <select
                    value={addForm.permissions}
                    onChange={(e) => handleAddChange('permissions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {permissionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={addForm.description}
                    onChange={(e) => handleAddChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter description"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

      {/* Edit Modal */}
      {isEditModalOpen && editingRole && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Role</h3>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <select
                    value={editForm.permissions}
                    onChange={(e) => handleEditChange('permissions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {permissionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleEditChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissions;