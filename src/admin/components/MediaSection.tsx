import type { MediaSectionData } from "../types/project.types";

interface Props {
  data: MediaSectionData;
  onChange: (data: MediaSectionData) => void;
}

export default function MediaSection({ data, onChange }: Props) {
  const addUrl = () => {
    onChange({
      items: [...data.items, { url: "" }]
    });
  };

  const updateUrl = (index: number, value: string) => {
    const updated = [...data.items];
    updated[index] = { url: value };
    onChange({ items: updated });
  };

  const removeUrl = (index: number) => {
    if (window.confirm("Are you sure you want to remove this media URL?")) {
      onChange({
        items: data.items.filter((_, i) => i !== index)
      });
    }
  };

  // Helper to detect URL type
  const getUrlType = (url: string): "youtube" | "virtual-tour" | "other" => {
    if (!url) return "other";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("virtual") || url.includes("tour") || url.includes("360")) return "virtual-tour";
    return "other";
  };

  // Extract YouTube video ID for preview
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">Media / Video URLs</h3>
        </div>
        <button
          onClick={addUrl}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add URL
        </button>
      </div>

      <div className="space-y-4">
        {data.items.map((item, index) => {
          const urlType = getUrlType(item.url);
          const youtubeId = getYouTubeId(item.url);

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-all duration-200 relative group"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeUrl(index)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Remove URL"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-4 pr-10">
                {/* URL Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    {urlType === "youtube" ? (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    ) : urlType === "virtual-tour" ? (
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    )}
                    Media URL #{index + 1}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste YouTube, Virtual Tour, or other media URL here"
                      value={item.url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
                    />
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                        title="Open in new tab"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open
                      </a>
                    )}
                  </div>
                </div>

                {/* YouTube Preview */}
                {urlType === "youtube" && youtubeId && (
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title="YouTube video preview"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* URL Type Badge */}
                {item.url && (
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      urlType === "youtube" 
                        ? "bg-red-100 text-red-700" 
                        : urlType === "virtual-tour"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {urlType === "youtube" && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )}
                      {urlType === "youtube" ? "YouTube Video" : urlType === "virtual-tour" ? "Virtual Tour" : "Media URL"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {data.items.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 font-medium text-lg mb-2">No media URLs added yet</p>
            <p className="text-gray-400 text-sm">Add YouTube videos, virtual tours, or other media links</p>
          </div>
        )}
      </div>

      {/* Info Text */}
      {data.items.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Supported formats: YouTube videos, virtual tour links, and other embeddable media URLs. YouTube videos will show a preview automatically.</span>
          </p>
        </div>
      )}
    </div>
  );
}
