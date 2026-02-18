import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { uploadSingleImage } from "../../../services/upload";

// Self-hosted TinyMCE (no Tiny Cloud / no API key)
import "tinymce/tinymce";
import "tinymce/models/dom";
import "tinymce/icons/default";
import "tinymce/themes/silver";

// Plugins (must be imported for self-hosted bundling)
import "tinymce/plugins/autoresize";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/table";
import "tinymce/plugins/code";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/preview";
import "tinymce/plugins/searchreplace";

// UI + content styles (TinyMCE skin)
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/content/default/content.min.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  height?: number;
};

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return "Unknown error";
  }
}

export default function RichTextEditor({ value, onChange, disabled, height = 520 }: Props) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPickFile = () =>
    new Promise<File | null>((resolve) => {
      const el = fileInputRef.current;
      if (!el) return resolve(null);
      el.onchange = () => {
        const f = el.files?.[0] || null;
        el.value = "";
        resolve(f);
      };
      el.click();
    });

  return (
    <div className="space-y-2">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />

      <div className={disabled ? "opacity-70 pointer-events-none" : ""}>
        <Editor
          value={value}
          onEditorChange={(content) => onChange(content)}
          licenseKey="gpl"
          init={{
            height,
            menubar: false,
            branding: false,
            statusbar: true,
            plugins: [
              "autoresize",
              "lists",
              "link",
              "image",
              "table",
              "code",
              "wordcount",
              "preview",
              "searchreplace",
            ],
            toolbar:
              "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image table | removeformat | code preview",
            content_style:
              "body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; font-size: 16px; } img { max-width: 100%; height: auto; }",

            /* SEO/accessibility: show alt field in image dialog */
            image_title: true,
            image_description: true,
            image_advtab: true,

            /* Uploads */
            automatic_uploads: true,
            file_picker_types: "image",
            file_picker_callback: async (cb) => {
              setUploadError(null);
              try {
                const f = await onPickFile();
                if (!f) return;
                const url = await uploadSingleImage("blogs", f);
                const alt = window.prompt("Image alt text (for accessibility/SEO):", "") || "";
                cb(url, { alt, title: alt });
              } catch (e: unknown) {
                setUploadError(getErrorMessage(e) || "Image upload failed");
              }
            },
            images_upload_handler: async (blobInfo) => {
              setUploadError(null);
              try {
                const blob = blobInfo.blob();
                const file = new File([blob], blobInfo.filename(), { type: blob.type });
                const url = await uploadSingleImage("blogs", file);
                return url;
              } catch (e: unknown) {
                const msg = getErrorMessage(e) || "Image upload failed";
                setUploadError(msg);
                throw new Error(msg);
              }
            },
          }}
        />
      </div>

      {uploadError && <div className="text-sm text-red-600">{uploadError}</div>}
      <div className="text-xs text-gray-500">
        Tip: when inserting an image, always add an <strong>alt</strong> description.
      </div>
    </div>
  );
}

