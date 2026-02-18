import apiClient from "./apiClient";

// List all projects (commercial + residential)
export const getProjects = async () => {
  const response = await apiClient.get("/projects");
  return response.data;
};

// Fetch single project by slug (backend: GET /api/projects/:slug)
export const getProjectBySlug = async (slug) => {
  const response = await apiClient.get(`/projects/${slug}`);
  return response.data;
};

// Fetch sections of a project using project ID
export const getProjectSections = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/sections`);
  return response.data;
};
