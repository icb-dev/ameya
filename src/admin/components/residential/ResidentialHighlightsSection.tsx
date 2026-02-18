import { uploadSingleImage, getImageUrl } from "../../../services/upload";
import type { ResidentialHighlightsSectionData, ResidentialHighlightItem } from "../../types/project.types";

interface Props {
  data: ResidentialHighlightsSectionData;
  onChange: (data: ResidentialHighlightsSectionData) => void;
}

export default function ResidentialHighlightsSection({ data, onChange }: Props) {
  const addHighlight = () => {
    const next: ResidentialHighlightItem = {
      image: "",
      title: "",
      description: ""
    };
    onChange({
      items: [...data.items, next]
    });
  };

  const updateHighlight = (
    index: number,
    field: keyof ResidentialHighlightItem,
    value: string
  ) => {
    const updated = [...data.items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ items: updated });
  };

  const removeHighlight = (index: number) => {
    if (window.confirm("Remove this project highlight?")) {
      onChange({
        items: data.items.filter((_, i) => i !== index)
      });
    }
  };

  const uploadImage = async (index: number, file: File) => {
    const url = await uploadSingleImage("highlights", file);
    updateHighlight(index, "image", url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">Project Highlights</h3>
        </div>
        <button
          type="button"
          onClick={addHighlight}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Highlight
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50/60 hover:shadow-md transition-all duration-200 relative group"
          >
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeHighlight(index)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Remove highlight"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Image</label>
              {item.image ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 group/image">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title || "Project highlight"}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      console.error("Failed to load residential highlight image:", item.image);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                    <input
                      type="file"
                      accept="image/*"
                      id={`res-highlight-upload-${index}`}
                      onChange={(e) => e.target.files && uploadImage(index, e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor={`res-highlight-upload-${index}`}
                      className="px-4 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg cursor-pointer text-xs font-medium shadow-lg transition-all"
                    >
                      Change Image
                    </label>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id={`res-highlight-upload-${index}`}
                    onChange={(e) => e.target.files && uploadImage(index, e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor={`res-highlight-upload-${index}`}
                    className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group/upload"
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover/upload:text-blue-600 transition-colors">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Click to upload image</span>
                      <span className="text-xs">PNG, JPG up to 10MB</span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                placeholder="e.g. Resort-style Clubhouse"
                value={item.title}
                onChange={(e) => updateHighlight(index, "title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                placeholder="Short description about this highlight..."
                value={item.description}
                onChange={(e) => updateHighlight(index, "description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        ))}

        {data.items.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100/60 rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 font-medium text-lg mb-1">No project highlights added yet</p>
            <p className="text-gray-400 text-sm">Use &quot;Add Highlight&quot; to showcase key USPs of the project.</p>
          </div>
        )}
      </div>
    </div>
  );
}
