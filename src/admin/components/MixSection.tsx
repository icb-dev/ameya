import { uploadSingleImage, getImageUrl } from "../../services/upload";
import type { MixSectionData } from "../types/project.types";

interface Props {
  data: MixSectionData;
  onChange: (data: MixSectionData) => void;
}

export default function MixSection({ data, onChange }: Props) {

  const addCard = () => {
    onChange({
      items: [
        ...data.items,
        {
          image: "",
          title: "",
          description: ""
        }
      ]
    });
  };

  const updateCard = (
    index: number,
    field: "image" | "title" | "description",
    value: string
  ) => {
    const updated = [...data.items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ items: updated });
  };

  const uploadImage = async (index: number, file: File) => {
    const url = await uploadSingleImage("misc", file);
    updateCard(index, "image", url);
  };

  const removeCard = (index: number) => {
    onChange({
      items: data.items.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">The Mix</h3>
        <button
          onClick={addCard}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Add Mix Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative group"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-700">Card #{index + 1}</h4>
              <button
                onClick={() => removeCard(index)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove Card"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* IMAGE */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && uploadImage(index, e.target.files[0])}
                  className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {item.image && (
                  <div className="relative w-full h-32 border rounded overflow-hidden bg-white mt-2">
                    <img
                      src={getImageUrl(item.image)}
                      alt="Mix"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        console.error("Failed to load mix image:", item.image);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* TITLE */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => updateCard(index, "title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  placeholder="Description"
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateCard(index, "description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
        {data.items.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No mix cards added yet. Click the button above to add one.
          </div>
        )}
      </div>
    </div>
  );
}
