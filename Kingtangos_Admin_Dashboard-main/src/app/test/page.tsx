'use client';

import React from 'react';
import EditorClient from './components/client_sidde_custom_editor';

const TestPage = () => {
  const [editorTitle, setEditorTitle] = React.useState('privecy');
  const [editorData, setEditorData] = React.useState('');

  const handleDataChange = (data: string) => {
    setEditorData(data);
    console.log(data); // This logs to browser console
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        hello i am test
        {/* Title Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Editor Title:</label>
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter editor title"
          />
        </div>

        {/* Editor Component */}
        <EditorClient title={editorTitle} onDataChange={handleDataChange} />

</div>
    </div>
  );
};

export default TestPage;
