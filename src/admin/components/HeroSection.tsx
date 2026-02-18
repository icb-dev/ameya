import { uploadSingleImage, getImageUrl } from "../../services/upload";
import type { HeroSectionData } from "../types/project.types";

interface Props {
  data: HeroSectionData;
  onChange: (data: HeroSectionData) => void;
}

export default function HeroSection({ data, onChange }: Props) {
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "background_banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadSingleImage("hero", file);

    onChange({
      ...data,
      [field]: url
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "logo")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {data.logo && (
              <div className="relative w-20 h-20 border rounded overflow-hidden">
                <img 
                  src={getImageUrl(data.logo)} 
                  alt="Logo" 
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    console.error("Failed to load logo image:", data.logo);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Banner</label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "background_banner")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {data.background_banner && (
              <div className="relative w-full h-40 border rounded overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(data.background_banner)}
                  alt="Banner"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    console.error("Failed to load banner image:", data.background_banner);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      
      
    </div>
    
  );
}
