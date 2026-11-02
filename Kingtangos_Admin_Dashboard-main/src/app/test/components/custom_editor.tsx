// "use client";

// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import {
//   ClassicEditor,
//   Essentials,
//   Paragraph,
//   Heading,
//   Bold,
//   Italic,
//   Strikethrough,
//   Subscript,
//   Superscript,
//   Link,
//   List,
//   TodoList,
//   Font,
//   Table,
//   TableToolbar,
//   Underline,
//   TableCaption,
//   TableCellProperties,
//   TableColumnResize,
//   TableLayout,
//   TableProperties,
//   ListEditing,
//   ListElementSupport,
//   ListFormatting,
//   PlainTableOutput,
//   ListProperties,
//   ListPropertiesEditing,
//   Highlight,
//   Autoformat,
//   Alignment,
// } from "ckeditor5";

// import "ckeditor5/ckeditor5.css";

// interface CustomEditorProps {
//   title?: string;
//   onDataChange?: (data: string) => void;
// }

// function CustomEditor({ title = "My Editor", onDataChange }: CustomEditorProps) {
//   return (
//     <CKEditor
//       editor={ClassicEditor}
//       config={{
//         licenseKey: "GPL",

//         plugins: [
//           Alignment,
//           Autoformat,
//           Essentials,
//           Highlight,
//           Paragraph,
//           Heading,
//           Bold,
//           Italic,
//           Strikethrough,
//           Underline,
//           Subscript,
//           Superscript,
//           Font,
//           Link,
//           List,
//           ListEditing,
//           ListElementSupport,
//           ListFormatting,
//           ListProperties,
//           ListPropertiesEditing,
//           TodoList,
//           Table,
//           TableCaption,
//           TableCellProperties,
//           TableColumnResize,
//           TableLayout,
//           TableProperties,
//           TableToolbar,
//           PlainTableOutput,
//         ],

//         toolbar: {
//           items: [
//             "undo",
//             "redo",
//             "|",
//             "heading",
//             "|",
//             "fontSize",
//             "fontColor",
//             "fontBackgroundColor",
//             "highlight",
//             "|",
//             "bold",
//             "italic",
//             "strikethrough",
//             "underline",
//             "subscript",
//             "superscript",
//             "|",
//             "link",
//             "|",
//             "bulletedList",
//             "numberedList",
//             "todoList",
//             "|",
//             "insertTable",
//             "|",
//             "alignment",
//           ],
//           shouldNotGroupWhenFull: true,
//         },

//         list: {
//           enableListItemMarkerFormatting: true,
//         },

//         fontSize: {
//           options: [9, 11, 13, "default", 17, 19, 21, 22, 24, 26, 28, 30, 32],
//           supportAllValues: true,
//         },

//         table: {
//           contentToolbar: [
//             "tableColumn",
//             "tableRow",
//             "mergeTableCells",
//             "tableCellProperties",
//             "tableProperties",
//           ],
//         },

//         initialData: `<p>${title}</p>`,
//       }}
//       onChange={(event, editor) => {
//         const data = editor.getData();
//         console.log({ data });
//         if (onDataChange) {
//           onDataChange(data);
//         }
//       }}
//     />
//   );
// }

// export default CustomEditor;

"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Link,
  List,
  TodoList,
  Font,
  Table,
  TableToolbar,
  Underline,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableLayout,
  TableProperties,
  ListProperties,
  Highlight,
  Autoformat,
  Alignment,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface CustomEditorProps {
  title?: string;
  onDataChange?: (data: string) => void;
}

function CustomEditor({ title = "My Editor", onDataChange }: CustomEditorProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        licenseKey: "GPL",
        plugins: [
          Essentials,
          Heading,
          Bold,
          Italic,
          Strikethrough,
          Underline,
          Subscript,
          Superscript,
          Font,
          Link,
          List,
          ListProperties,
          TodoList,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableLayout,
          TableProperties,
          TableToolbar,
          Highlight,
          Autoformat,
          Alignment,
        ],
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "fontSize",
            "fontColor",
            "fontBackgroundColor",
            "highlight",
            "|",
            "bold",
            "italic",
            "strikethrough",
            "underline",
            "subscript",
            "superscript",
            "|",
            "link",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "|",
            "insertTable",
            "|",
            "alignment",
          ],
        },
        fontSize: {
          options: [9, 11, 13, "default", 17, 19, 21, 22, 24, 26, 28, 30, 32],
        },
        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableCellProperties",
            "tableProperties",
          ],
        },
        initialData: `<p>${title}</p>`,
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ data });
        if (onDataChange) {
          onDataChange(data);
        }
      }}
      onError={(error) => {
        console.error("CKEditor Error:", error);
      }}
    />
  );
}

export default CustomEditor;