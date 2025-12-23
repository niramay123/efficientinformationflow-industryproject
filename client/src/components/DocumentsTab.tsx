import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { getAllDocumentsAPI, uploadDocumentAPI, deleteDocumentAPI } from "../services/apiDoc.services.js";
import { Download, Trash2 } from "lucide-react";

export default function DocumentTab() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<any[]>([]);
  const [docForm, setDocForm] = useState({ title: "", filter: "Safety", file: null });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await getAllDocumentsAPI();
      if (res.data.success) setDocuments(res.data.documents);
    } catch (err) {
      console.error(err);
      alert(t('failedToFetchDocs'));
    }
  };

  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title || !docForm.file) return alert(t('provideTitleFile'));

    const formData = new FormData();
    formData.append("title", docForm.title);
    formData.append("filter", docForm.filter);
    formData.append("file", docForm.file);

    try {
      const res = await uploadDocumentAPI(formData);
      if (res.data.success) {
        setDocuments(prev => [res.data.document, ...prev]);
        setDocForm({ title: "", filter: "Safety", file: null });
      }
    } catch (err) {
      console.error(err);
      alert(t('uploadFailed'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteDoc'))) return;
    try {
      const res = await deleteDocumentAPI(id);
      if (res.data.success) {
        setDocuments(prev => prev.filter(d => d._id !== id));
      } else {
        alert(t('failedToDeleteDoc'));
      }
    } catch (err) {
      console.error(err);
      alert(t('failedToDeleteDoc'));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">{t('documentRepository')}</h2>
        <p className="text-sm text-gray-500">{t('docRepoSubtitle')}</p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleDocUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">{t('title')}</label>
          <input
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('docTitlePlaceholder')}
            value={docForm.title}
            onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('filterCategory')}</label>
          <select
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={docForm.filter}
            onChange={(e) => setDocForm({ ...docForm, filter: e.target.value })}
          >
            <option>{t('safety')}</option>
            <option>{t('maintenance')}</option>
            <option>{t('training')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('selectFile')}</label>
          <input
            type="file"
            className="border rounded px-3 py-2 w-full"
            onChange={(e) => setDocForm({ ...docForm, file: e.target.files[0] })}
          />
        </div>
        <div className="flex justify-start md:justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            {t('upload')}
          </button>
        </div>
      </form>

      {/* Documents Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{t('sr')}</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{t('title')}</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{t('filter')}</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{t('file')}</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{t('uploadedAt')}</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{t('action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-red-500">
                  {t('noDocsUploaded')}
                </td>
              </tr>
            )}
            {documents.map((doc, index) => (
              <tr key={doc._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{doc.title}</td>
                <td className="px-4 py-2">{doc.filter}</td>
                <td className="px-4 py-2">{doc.originalName}</td>
                <td className="px-4 py-2">{new Date(doc.uploadedAt).toLocaleString()}</td>
                <td className="px-4 py-2 flex gap-2">
                  <a
                    href={`/uploads/${doc.fileName}`}
                    download={doc.originalName}
                    className="px-3 py-1 border rounded text-blue-600 hover:bg-blue-50 flex items-center gap-1"
                  >
                    <Download size={16} /> {t('download')}
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="px-3 py-1 border rounded text-red-600 hover:bg-red-50 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
