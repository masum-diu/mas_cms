import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import the snow theme

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const TextEditor = ({ value, onChange, placeholder }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return isClient ? (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      theme="snow"
      placeholder={placeholder}
    />
  ) : null;
};

export default TextEditor;
