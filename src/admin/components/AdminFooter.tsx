export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-8">
      <div className="ml-64 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              © {currentYear} All rights reserved
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-gray-500">Developed by</span>
              <span className="font-bold text-blue-600 border-b-2 border-blue-600">ICB</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
