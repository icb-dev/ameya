import { uploadSingleImage, getImageUrl } from "../../services/upload";
import type { HighlightsSectionData } from "../types/project.types";

interface Props {
  data: HighlightsSectionData;
  onChange: (data: HighlightsSectionData) => void;
}

export default function HighlightsSection({ data, onChange }: Props) {

  // Add highlight point
  const addPoint = () => {
    onChange({
      ...data,
      highlights: [...data.highlights, ""]
    });
  };

  // Update highlight point
  const updatePoint = (index: number, value: string) => {
    const updated = [...data.highlights];
    updated[index] = value;
    onChange({ ...data, highlights: updated });
  };

  // Remove highlight point
  const removePoint = (index: number) => {
    onChange({
      ...data,
      highlights: data.highlights.filter((_, i) => i !== index)
    });
  };

  // Upload image
  const uploadImage = async (file: File) => {
    const url = await uploadSingleImage("misc", file);
    onChange({ ...data, image: url });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Highlights</h3>

      <div className="space-y-6">
        {/* HIGHLIGHT POINTS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Highlights List</label>
          <div className="space-y-3">
            {data.highlights.map((point, index) => (
              <div key={index} className="flex gap-2">
                <input
                  placeholder="e.g. 24x7 Security"
                  value={point}
                  onChange={(e) => updatePoint(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  onClick={() => removePoint(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addPoint}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              + Add Highlight Point
            </button>
          </div>
        </div>

        {/* IMAGE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Highlights Image</label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {data.image && (
              <div className="relative w-40 h-40 border rounded overflow-hidden bg-gray-100 mt-2">
                <img 
                  src={getImageUrl(data.image)} 
                  alt="Highlight" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    console.error("Failed to load highlight image:", data.image);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SIZE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <input
              placeholder="e.g. 1200–1800 sq.ft"
              value={data.size}
              onChange={(e) => onChange({ ...data, size: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <input
              placeholder="e.g. 2 & 3 BHK"
              value={data.type}
              onChange={(e) => onChange({ ...data, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            placeholder="Description"
            rows={4}
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
