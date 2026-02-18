import type { LocationSectionData } from "../types/project.types";

interface Props {
  data: LocationSectionData;
  onChange: (data: LocationSectionData) => void;
}

export default function LocationSection({ data, onChange }: Props) {
  const addLocation = () => {
    onChange({
      ...data,
      locations: [
        ...data.locations,
        { name: "", distance_time: "" }
      ]
    });
  };

  const updateLocation = (
    index: number,
    field: "name" | "distance_time",
    value: string
  ) => {
    const updated = [...data.locations];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, locations: updated });
  };

  const removeLocation = (index: number) => {
    if (window.confirm("Are you sure you want to remove this location?")) {
      onChange({
        ...data,
        locations: data.locations.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-900">Location Advantage</h3>
      </div>

      <div className="space-y-6">
        {/* NEARBY LOCATIONS */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Nearby Locations
            </label>
            <button
              onClick={addLocation}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Location
            </button>
          </div>

          <div className="space-y-3">
            {data.locations.map((loc, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-all duration-200 relative group"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeLocation(index)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Remove location"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                  {/* Location Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Location Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NH-8 Expressway, Airport, Metro Station"
                      value={loc.name}
                      onChange={(e) => updateLocation(index, "name", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
                    />
                  </div>

                  {/* Distance / Time */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Distance / Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10 mins drive, 2.5 km, 15 minutes"
                      value={loc.distance_time}
                      onChange={(e) => updateLocation(index, "distance_time", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
              </div>
            ))}

            {data.locations.length === 0 && (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-dashed border-gray-300">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500 font-medium mb-1">No locations added yet</p>
                <p className="text-gray-400 text-sm">Click the button above to add nearby locations</p>
              </div>
            )}
          </div>
        </div>

        {/* MAP URL */}
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map Location URL
          </label>
          <div className="relative">
            <input
              type="url"
              placeholder="Paste Google Maps embed URL or share link here"
              value={data.map_url}
              onChange={(e) => onChange({ ...data, map_url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md pr-12"
            />
            {data.map_url && (
              <a
                href={data.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                title="Open map in new tab"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Paste a Google Maps URL to show the project location
          </p>
        </div>
      </div>
    </div>
  );
}
