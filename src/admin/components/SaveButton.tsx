interface Props {
  onSave: () => void;
  loading?: boolean;
}

export default function SaveButton({ onSave, loading }: Props) {
  return (
    <button
      onClick={onSave}
      disabled={loading}
      className={`
        w-full sm:w-auto px-8 py-3 
        bg-blue-600 text-white font-medium rounded-lg shadow-sm
        hover:bg-blue-700 active:bg-blue-800
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-all duration-200
        disabled:opacity-70 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </>
      ) : (
        "Upload Project"
      )}
    </button>
  );
}
  