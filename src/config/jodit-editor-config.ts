// config/joditConfig.ts — alternative without jodit/types import
/* eslint-disable @typescript-eslint/no-explicit-any */

type InsertMode =
  | "insert_as_html"
  | "insert_clear_html"
  | "insert_only_text"
  | "insert_as_text";

export const joditConfig = {
  uploader: {
    url: `https://api.cloudinary.com/v1_1/do2cbxkkj/image/upload`,
    format: "json",
    prepareData: (formData: FormData) => {
      const file = formData.get("files[0]");
      if (!file) throw new Error("No file selected");
      formData.delete("files[0]");
      formData.append("file", file);
      formData.append("upload_preset", "zrf-foundation");
      return formData;
    },
    isSuccess: (resp: any) => !resp.error,
    process: (resp: any) => ({
      files: resp.secure_url ? [resp.secure_url] : [],
      path: resp.secure_url,
      error: resp.error,
      msg: resp.message,
    }),
    defaultHandlerSuccess: (response: any, component: any) => {
      if (response.files && response.files.length) {
        component.selection.insertImage(response.files[0], null, 250);
      }
    },
    error: (e: Error) => console.error("Upload error:", e.message),
  },

  height: 500,
  toolbarAdaptive: false,
  spellcheck: false,
  disablePlugins: ["speechRecognition"],
  enableDragAndDropFileToEditor: true,
  imageDefaultWidth: 250,
  replaceRelativeUrls: true,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html" as InsertMode,
};
