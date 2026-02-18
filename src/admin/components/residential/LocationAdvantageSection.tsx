import type { ResidentialLocationSectionData, ResidentialLocationItem } from "../../types/project.types";

interface Props {
  data: ResidentialLocationSectionData;
  onChange: (data: ResidentialLocationSectionData) => void;
}

export default function LocationAdvantageSection({ data, onChange }: Props) {
  const addLocation = () => {
    const next: ResidentialLocationItem = {
      name: "",
      distance_time: ""
    };
    onChange({
      ...data,
      locations: [...data.locations, next]
    });
  };

  const updateLocation = (index: number, field: keyof ResidentialLocationItem, value: string) => {
    const updated = [...data.locations];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, locations: updated });
  };

  const removeLocation = (index: number) => {
    if (window.confirm("Remove this nearby location?")) {
      onChange({
        ...data,
        locations: data.locations.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">Location Advantage</h3>
        </div>
        <button
          type="button"
          onClick={addLocation}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Nearby
        </button>
      </div>

      <div className="space-y-4">
        {data.locations.map((loc, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-white to-gray-50/60 hover:shadow-md transition-all duration-200 relative group"
          >
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeLocation(index)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Remove nearby"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Nearby Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Hub, Airport, School"
                  value={loc.name}
                  onChange={(e) => updateLocation(index, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Distance / Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10 mins, 4 km"
                  value={loc.distance_time}
                  onChange={(e) => updateLocation(index, "distance_time", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </div>
        ))}

        {data.locations.length === 0 && (
          <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-gray-100/60 rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 font-medium text-lg mb-1">No nearby locations added yet</p>
            <p className="text-gray-400 text-sm">Use &quot;Add Nearby&quot; to highlight key connectivity advantages.</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Map Location (URL)
        </label>
        <input
          type="url"
          placeholder="Google Maps embed or share URL"
          value={data.map_location}
          onChange={(e) => onChange({ ...data, map_location: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
        />
      </div>
    </div>
  );
}

