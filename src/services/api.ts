const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AUTH_TOKEN_KEY = "admin_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export const AUTH_LOGOUT_EVENT = "auth:logout";

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function clearAuthOn401(): void {
  setStoredToken(null);
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
}

// Auth: login and me
export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Login failed");
  }
  return res.json();
};

export const getMe = async (): Promise<AuthUser> => {
  const res = await fetch(`${BASE_URL}/login/me`, {
    headers: getAuthHeaders(),
  });
  if (res.status === 401) {
    clearAuthOn401();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("Failed to get current user");
  return res.json();
};

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  const res = await fetch(`${BASE_URL}/login/password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err.message as string) || `Failed to update password (${res.status})`
    );
  }
  return res.json();
};

export interface Project {
  id: string;
  slug: string;
  project_name: string;
  status: "ongoing" | "completed";
  sector: string;
  city: string;
  project_type: string;
  project_logo: string;
  project_thumbnail: string;
  featured?: "yes" | "no";
  created_at?: string;
}

export interface ProjectSectionPayload {
  project_id: string;
  section_type: string;
  position: number;
  data: unknown;
}

export interface ProjectSectionRecord {
  id: string;
  section_type: string;
  position: number;
  // NOTE: backend stores this as JSON string, we normalise to object in client
  data: unknown;
}

// CREATE PROJECT
export const createProject = async (
  payload: Omit<Project, "id">
): Promise<{ id: string }> => {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Create project failed");
  }

  return res.json();
};

// ADD SECTION
export const addSection = async (
  payload: ProjectSectionPayload
): Promise<{ id: string }> => {
  const res = await fetch(`${BASE_URL}/projects/sections`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Add section failed");
  }

  return res.json();
};

// FETCH ALL PROJECTS
export const fetchAllProjects = async (): Promise<Project[]> => {
  const url = `${BASE_URL}/projects`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// DELETE PROJECT
export const deleteProject = async (projectId: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to delete project");
  }
};

// FETCH SINGLE PROJECT (for edit page)
// Backed only by the list API to avoid JSON parse issues on /projects/:id
export const fetchProjectById = async (projectId: string): Promise<Project> => {
  const all = await fetchAllProjects();
  const found = all.find((p) => p.id === projectId);

  if (!found) {
    throw new Error("Project not found");
  }

  return found;
};

// FETCH ALL SECTIONS FOR A PROJECT
export const fetchProjectSections = async (
  projectId: string
): Promise<ProjectSectionRecord[]> => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/sections`, {
    headers: getAuthHeaders(),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to fetch project sections");
  }

  const raw: unknown = await res.json();

  if (!Array.isArray(raw)) return [];

  // Normalise data: backend sends `data` as JSON string, convert to object
  return raw.map((section: unknown) => {
    const s = section as Record<string, unknown>;
    let parsedData: unknown = s.data;
    if (typeof s.data === "string") {
      try {
        parsedData = JSON.parse(s.data);
      } catch {
        // keep as-is if parse fails
        parsedData = {};
      }
    }
    return {
      id: String(s.id),
      section_type: String(s.section_type),
      position: Number(s.position),
      data: parsedData,
    } as ProjectSectionRecord;
  });
};

// UPDATE PROJECT (PATCH)
export const updateProject = async (
  projectId: string,
  payload: Partial<Project>
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to update project");
  }
};

// UPDATE A SECTION (PATCH) - does NOT create new sections
export const updateProjectSection = async (
  payload: ProjectSectionPayload
): Promise<void> => {
  const res = await fetch(
    `${BASE_URL}/projects/${payload.project_id}/sections/type/${payload.section_type}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        position: payload.position,
        data: payload.data
      })
    }
  );
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error(`Failed to update ${payload.section_type} section`);
  }
};

// TOGGLE FEATURED STATUS
export const toggleFeaturedStatus = async (
  projectId: string,
  featured: "yes" | "no"
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ featured })
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to update featured status");
  }
};

// FETCH FEATURED PROJECTS
export const fetchFeaturedProjects = async (): Promise<Project[]> => {
  const url = `${BASE_URL}/projects/featured`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error(`Failed to fetch featured projects: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// HOME SECTION CRUD OPERATIONS
export interface HomeEntry {
  id: string;
  banner_image: string;
  title: string;
  large_title: string;
  button_url: string;
  created_at?: string;
}

export interface CreateHomeEntryPayload {
  banner_image: string;
  title: string;
  large_title: string;
  button_url: string;
}

export interface UpdateHomeEntryPayload {
  banner_image?: string;
  title?: string;
  large_title?: string;
  button_url?: string;
}

// FETCH ALL HOME ENTRIES
export const fetchAllHomeEntries = async (): Promise<HomeEntry[]> => {
  const url = `${BASE_URL}/home`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error(`Failed to fetch home entries: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// FETCH SINGLE HOME ENTRY
export const fetchHomeEntry = async (id: string): Promise<HomeEntry> => {
  const res = await fetch(`${BASE_URL}/home/${id}`, {
    headers: getAuthHeaders(),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to fetch home entry");
  }
  return res.json();
};

// CREATE HOME ENTRY
export const createHomeEntry = async (
  payload: CreateHomeEntryPayload
): Promise<{ id: string; message: string }> => {
  const res = await fetch(`${BASE_URL}/home`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to create home entry");
  }
  return res.json();
};

// UPDATE HOME ENTRY
export const updateHomeEntry = async (
  id: string,
  payload: UpdateHomeEntryPayload
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/home/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to update home entry");
  }
  return res.json();
};

// DELETE HOME ENTRY
export const deleteHomeEntry = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/home/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok && res.status !== 404) {
    throw new Error("Failed to delete home entry");
  }
};

// ABOUT SECTION CRUD OPERATIONS
export interface AboutEntry {
  id: string;
  video_url: string;
  delivered_projects: string;
  ongoing_development: string;
  satisfied_customers: string;
  brand_partnerships: string;
  created_at?: string;
}

export interface CreateAboutEntryPayload {
  video_url: string;
  delivered_projects: string;
  ongoing_development: string;
  satisfied_customers: string;
  brand_partnerships: string;
}

export interface UpdateAboutEntryPayload {
  video_url?: string;
  delivered_projects?: string;
  ongoing_development?: string;
  satisfied_customers?: string;
  brand_partnerships?: string;
}

export interface AboutLogo {
  id: string;
  about_id: string;
  image_url: string;
  position: number;
  created_at?: string;
}

export interface CreateAboutLogoPayload {
  image_url: string;
  position?: number;
}

// FETCH ALL ABOUT ENTRIES
export const fetchAllAboutEntries = async (): Promise<AboutEntry[]> => {
  const url = `${BASE_URL}/about`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error(`Failed to fetch about entries: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// FETCH SINGLE ABOUT ENTRY
export const fetchAboutEntry = async (id: string): Promise<AboutEntry> => {
  const res = await fetch(`${BASE_URL}/about/${id}`, {
    headers: getAuthHeaders(),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to fetch about entry");
  }
  return res.json();
};

// CREATE ABOUT ENTRY
export const createAboutEntry = async (
  payload: CreateAboutEntryPayload
): Promise<{ id: string; message: string }> => {
  const res = await fetch(`${BASE_URL}/about`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to create about entry");
  }
  return res.json();
};

// UPDATE ABOUT ENTRY
export const updateAboutEntry = async (
  id: string,
  payload: UpdateAboutEntryPayload
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/about/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to update about entry");
  }
  return res.json();
};

// DELETE ABOUT ENTRY
export const deleteAboutEntry = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/about/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok && res.status !== 404) {
    throw new Error("Failed to delete about entry");
  }
};

// FETCH ALL LOGOS FOR AN ABOUT ENTRY
export const fetchAboutLogos = async (aboutId: string): Promise<AboutLogo[]> => {
  const url = `${BASE_URL}/about/${aboutId}/logos`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error(`Failed to fetch logos: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// ADD LOGO TO ABOUT ENTRY
export const addAboutLogo = async (
  aboutId: string,
  payload: CreateAboutLogoPayload
): Promise<{ id: string; message: string }> => {
  const res = await fetch(`${BASE_URL}/about/${aboutId}/logos`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok) {
    throw new Error("Failed to add logo");
  }
  return res.json();
};

// DELETE LOGO
export const deleteAboutLogo = async (logoId: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/about/logos/${logoId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status === 401) clearAuthOn401();
  if (!res.ok && res.status !== 404) {
    throw new Error("Failed to delete logo");
  }
};
