import { uploadSingleImage, getImageUrl } from "../../../services/upload";
import type { ResidentialHeroSectionData } from "../../types/project.types";

interface Props {
  data: ResidentialHeroSectionData;
  onChange: (data: ResidentialHeroSectionData) => void;
}

export default function ResidentialHeroSection({ data, onChange }: Props) {
  const handleUpload = async (field: "logo" | "background_banner", file: File) => {
    const folder = field === "logo" ? "logo" : "banner";
    const url = await uploadSingleImage(folder, file);
    onChange({
      ...data,
      [field]: url
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-900">Hero Section (Logo & Banner)</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleUpload("logo", e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {data.logo && (
            <div className="mt-3 inline-block border border-gray-200 rounded-lg p-2 bg-gray-50">
              <img
                src={getImageUrl(data.logo)}
                alt="Project logo"
                className="h-20 object-contain"
                onError={(e) => {
                  console.error("Failed to load residential hero logo:", data.logo);
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Background Banner */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Banner
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleUpload("background_banner", e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {data.background_banner && (
            <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={getImageUrl(data.background_banner)}
                alt="Background banner"
                className="w-full h-32 object-cover"
                onError={(e) => {
                  console.error("Failed to load residential hero banner:", data.background_banner);
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
