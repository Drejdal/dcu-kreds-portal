export default function DokumenterPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dokumenter</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Google Drive Integration</h3>
          <p className="mt-1 text-sm text-gray-500">
            Google Drive integration vil blive implementeret her.
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Mappestruktur:<br />
            DCU Kreds/Dokumenter/Referater<br />
            DCU Kreds/Dokumenter/Vedtægter<br />
            DCU Kreds/Dokumenter/Skabeloner
          </p>
        </div>
      </div>
    </div>
  )
}
