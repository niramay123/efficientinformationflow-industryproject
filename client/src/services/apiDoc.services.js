import apiClient from "../apiClient";

// Fetch all documents
export const getAllDocumentsAPI = () => apiClient.get("/documents");

// Upload document (with FormData)
export const uploadDocumentAPI = (formData) =>
  apiClient.post("/uploadDocument", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteDocumentAPI = (id) => apiClient.delete(`/documents/${id}`);
