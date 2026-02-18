import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";
import HeroSection from "../components/HeroSection";
import OverviewSection from "../components/OverviewSection";
import HighlightsSection from "../components/HighlightsSection";
import MixSection from "../components/MixSection";
import AmenitiesSection from "../components/AmenitiesSection";
import LocationSection from "../components/LocationSection";
import GallerySection from "../components/GallerySection";
import MediaSection from "../components/MediaSection";
import FaqSection from "../components/FaqSection";
import SaveButton from "../components/SaveButton";
import UnitLayoutSection from "../components/residential/UnitLayoutSection";
import ResidentialOverviewSection from "../components/residential/ResidentialOverviewSection";
import ResidentialHighlightsSection from "../components/residential/ResidentialHighlightsSection";
import ImmersiveTourSection from "../components/residential/ImmersiveTourSection";
import { uploadSingleImage } from "../../services/upload";

import {
  type HeroSectionData,
  type ProjectMeta,
  type OverviewSectionData,
  type HighlightsSectionData,
  type ResidentialHighlightsSectionData,
  type ImmersiveTourSectionData,
  type MixSectionData,
  type AmenitiesSectionData,
  type LocationSectionData,
  type GallerySectionData,
  type MediaSectionData,
  type FaqSectionData,
  type ReraSectionData,
  type UnitLayoutSectionData,
} from "../types/project.types";

import {
  fetchProjectById,
  fetchProjectSections,
  updateProject,
  updateProjectSection,
  addSection,
  type ProjectSectionRecord,
} from "../../services/api";

// Auto-generate slug from project name (same logic as create pages)
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

export default function EditProject() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [project, setProject] = useState<ProjectMeta | null>(null);

  const [hero, setHero] = useState<HeroSectionData>({
    logo: "",
    background_banner: "",
  });

  const [overview, setOverview] = useState<OverviewSectionData>({
    heading: "",
    description: "",
    image: "",
    key_features: [],
  });

  const [highlights, setHighlights] = useState<
    HighlightsSectionData | ResidentialHighlightsSectionData
  >(
    {
      // default shape for commercial / generic projects
      highlights: [],
      image: "",
      size: "",
      type: "",
      description: "",
    } as HighlightsSectionData
  );

  const [mix, setMix] = useState<MixSectionData>({
    items: [],
  });

  const [amenities, setAmenities] = useState<AmenitiesSectionData>({
    items: [],
  });

  const [location, setLocation] = useState<LocationSectionData>({
    locations: [],
    map_url: "",
  });

  const [gallery, setGallery] = useState<GallerySectionData>({
    images: [],
  });

  const [media, setMedia] = useState<MediaSectionData>({
    items: [],
  });

  const [faqs, setFaqs] = useState<FaqSectionData>({
    items: [],
  });

  const [rera, setRera] = useState<ReraSectionData>({
    rera: "",
  });

  const [unitLayout, setUnitLayout] = useState<UnitLayoutSectionData>({
    items: [],
  });

  const [immersiveTour, setImmersiveTour] = useState<ImmersiveTourSectionData>({
    url1: "",
    url: "",
    image: "",
  });

  // Track which section types already exist so we don't accidentally create duplicates
  const [existingSectionTypes, setExistingSectionTypes] = useState<string[]>([]);

  // Load project + sections on mount
  useEffect(() => {
    if (!projectId) return;

    const load = async () => {
      try {
        setInitialLoading(true);

        // Fetch project meta
        const projectData = await fetchProjectById(projectId);
        setProject({
          slug: projectData.slug,
          project_name: projectData.project_name,
          status: projectData.status,
          sector: projectData.sector,
          city: projectData.city,
          project_type: projectData.project_type,
          project_logo: projectData.project_logo,
          project_thumbnail: projectData.project_thumbnail,
          featured: projectData.featured || "no",
        });

        // Fetch all sections once
        const sections: ProjectSectionRecord[] =
          await fetchProjectSections(projectId);

        setExistingSectionTypes(sections.map((s) => s.section_type));

        const byType = (type: string) =>
          sections.find((s) => s.section_type === type)?.data;

        setHero(
          (byType("hero") as HeroSectionData) ?? {
            logo: "",
            background_banner: "",
          }
        );

        const overviewData = byType("overview") as
          | (OverviewSectionData & { key_features?: string[]; images?: string[] })
          | undefined;

        setOverview(
          overviewData
            ? {
                heading: overviewData.heading ?? "",
                description: overviewData.description ?? "",
                image: overviewData.image ?? "",
                images: overviewData.images ?? (overviewData.image ? [overviewData.image] : []),
                key_features: overviewData.key_features ?? [],
              }
            : {
                heading: "",
                description: "",
                image: "",
                images: [],
                key_features: [],
              }
        );

        if (projectData.project_type === "residential") {
          // Residential projects store highlights under section_type "project_highlights"
          const residentialHighlightsData = byType(
            "project_highlights"
          ) as ResidentialHighlightsSectionData | undefined;

          setHighlights(
            residentialHighlightsData ?? {
              items: [],
            }
          );

          const immersiveData = byType(
            "immersive_tour"
          ) as ImmersiveTourSectionData | undefined;

          setImmersiveTour(
            immersiveData ?? {
              url1: "",
              url: "",
              image: "",
            }
          );
        } else {
          // Commercial / generic projects use the generic "highlights" section
          const genericHighlightsData = byType("highlights") as
            | HighlightsSectionData
            | undefined;

          setHighlights(
            genericHighlightsData ?? {
              highlights: [],
              image: "",
              size: "",
              type: "",
              description: "",
            }
          );
        }

        setMix(
          (byType("mix") as MixSectionData) ?? {
            items: [],
          }
        );

        setAmenities(
          (byType("amenities") as AmenitiesSectionData) ?? {
            items: [],
          }
        );

        setLocation(
          (byType("location") as LocationSectionData) ?? {
            locations: [],
            map_url: "",
          }
        );

        setGallery(
          (byType("gallery") as GallerySectionData) ?? {
            images: [],
          }
        );

        setMedia(
          (byType("media") as MediaSectionData) ?? {
            items: [],
          }
        );

        setFaqs(
          (byType("faqs") as FaqSectionData) ?? {
            items: [],
          }
        );

        setRera(
          (byType("rera") as ReraSectionData) ?? {
            rera: "",
          }
        );

        setUnitLayout(
          (byType("unit_layout") as UnitLayoutSectionData) ?? {
            items: [],
          }
        );
      } catch (err) {
        console.error("Failed to load project for editing", err);
        const message =
          err instanceof Error ? err.message : "Unknown error loading project";
        alert(`Failed to load project: ${message}`);
        navigate("/admin/projects");
      } finally {
        setInitialLoading(false);
      }
    };

    void load();
  }, [projectId, navigate]);

  if (!projectId) {
    return <div>Invalid project ID.</div>;
  }

  const handleSave = async () => {
    if (!project) return;

    try {
      setLoading(true);

      // Update project meta
      await updateProject(projectId, {
        slug: project.slug,
        project_name: project.project_name,
        status: project.status,
        sector: project.sector,
        city: project.city,
        project_type: project.project_type,
        project_logo: project.project_logo,
        project_thumbnail: project.project_thumbnail,
        featured: project.featured,
      });

      // Helper to upsert a section if it has meaningful data
      const upsertSection = async (
        sectionType: string,
        position: number,
        data: unknown,
        hasData: boolean
      ) => {
        if (!hasData) return;
        const exists = existingSectionTypes.includes(sectionType);

        if (exists) {
          await updateProjectSection({
            project_id: projectId,
            section_type: sectionType,
            position,
            data,
          });
        } else {
          await addSection({
            project_id: projectId,
            section_type: sectionType,
            position,
            data,
          });
          setExistingSectionTypes((prev) =>
            prev.includes(sectionType) ? prev : [...prev, sectionType]
          );
        }
      };

      await upsertSection("hero", 1, hero, !!(hero.logo || hero.background_banner));

      await upsertSection(
        "overview",
        2,
        overview,
        !!(
          overview.heading ||
          overview.description ||
          overview.image ||
          (overview.images && overview.images.length > 0) ||
          (overview as OverviewSectionData).key_features?.length
        )
      );

      if (project.project_type === "residential") {
        const resHighlights = highlights as ResidentialHighlightsSectionData;
        await upsertSection(
          "project_highlights",
          3,
          resHighlights,
          resHighlights.items.length > 0
        );

        // IMMERSIVE TOUR (residential only, position 4)
        await upsertSection(
          "immersive_tour",
          4,
          immersiveTour,
          !!(immersiveTour.url1 || immersiveTour.url || immersiveTour.image)
        );
      } else {
        const genericHighlights = highlights as HighlightsSectionData;
        await upsertSection(
          "highlights",
          3,
          genericHighlights,
          !!(
            genericHighlights.highlights.length > 0 ||
            genericHighlights.image ||
            genericHighlights.size ||
            genericHighlights.type ||
            genericHighlights.description
          )
        );
      }

      await upsertSection("mix", 4, mix, mix.items.length > 0);

      await upsertSection(
        "amenities",
        5,
        amenities,
        amenities.items.length > 0
      );

      await upsertSection(
        "location",
        6,
        location,
        location.locations.length > 0 || !!location.map_url
      );

      await upsertSection("gallery", 7, gallery, gallery.images.length > 0);

      await upsertSection(
        "media",
        8,
        media,
        media.items.filter((i) => i.url).length > 0
      );

      await upsertSection("faqs", 9, faqs, faqs.items.length > 0);

      await upsertSection(
        "rera",
        10,
        rera,
        !!rera.rera
      );

      // Unit layout position depends on project type to match existing data
      const unitLayoutPosition =
        project.project_type === "residential" ? 7 : 11;

      await upsertSection(
        "unit_layout",
        unitLayoutPosition,
        unitLayout,
        unitLayout.items.length > 0
      );

      alert("Project updated successfully ✅");
    } catch (err) {
      console.error("Failed to update project", err);
      alert("Failed to update project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl"></div>
        </div>

        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-10 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Edit Project
                </h2>
              </div>
              <p className="text-gray-600 mt-2 text-lg ml-4">
                Update project details and sections, including amenities and other
                content.
              </p>
            </div>

            {/* PROJECT META (simple, reusing existing project meta structure) */}
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">
                  Project Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={project.project_name}
                    onChange={(e) => {
                      const projectName = e.target.value;
                      const autoSlug = projectName
                        ? generateSlug(projectName)
                        : project.slug;
                      setProject({
                        ...project,
                        project_name: projectName,
                        slug: autoSlug,
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                  />
                  {project.slug && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="mr-1">Slug:</span>
                      <span className="font-mono text-blue-600">
                        {project.slug}
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={project.status}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        status: e.target.value as "ongoing" | "completed",
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm hover:shadow-md"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="mt-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Featured Project</h4>
                      <p className="text-xs text-gray-600">
                        Mark this project as featured to highlight it on the homepage
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatured = project.featured === "yes" ? "no" : "yes";
                      setProject({ ...project, featured: newFeatured });
                    }}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      project.featured === "yes" ? "bg-amber-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                        project.featured === "yes" ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sector
                  </label>
                  <input
                    type="text"
                    value={project.sector}
                    onChange={(e) =>
                      setProject({ ...project, sector: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={project.city}
                    onChange={(e) =>
                      setProject({ ...project, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  RERA Number
                </label>
                <input
                  type="text"
                  value={rera.rera}
                  onChange={(e) =>
                    setRera({ rera: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                  placeholder="Enter RERA registration number"
                />
              </div>

              {/* PROJECT LOGO */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadSingleImage("logo", file);
                    setProject((prev) =>
                      prev ? { ...prev, project_logo: url } : prev
                    );
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {project.project_logo && (
                  <div className="mt-3">
                    <img
                      src={project.project_logo}
                      alt="Project Logo"
                      className="h-20 object-contain border border-gray-200 rounded-md p-2 bg-gray-50"
                    />
                  </div>
                )}
              </div>

              {/* PROJECT THUMBNAIL */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadSingleImage("thumbnail", file);
                    setProject((prev) =>
                      prev ? { ...prev, project_thumbnail: url } : prev
                    );
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {project.project_thumbnail && (
                  <div className="mt-3">
                    <img
                      src={project.project_thumbnail}
                      alt="Project Thumbnail"
                      className="w-40 h-24 object-cover border border-gray-200 rounded-md bg-gray-50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sections (re-use same components as create page) */}
            <HeroSection data={hero} onChange={setHero} />
            {project.project_type === "residential" ? (
              <ResidentialOverviewSection
                data={{
                  heading: overview.heading,
                  description: overview.description,
                  image: overview.image,
                  key_features: overview.key_features ?? [],
                }}
                onChange={(updated) =>
                  setOverview({
                    heading: updated.heading,
                    description: updated.description,
                    image: updated.image,
                    key_features: updated.key_features ?? [],
                  })
                }
              />
            ) : (
              <OverviewSection data={overview} onChange={setOverview} />
            )}
            {project.project_type === "residential" ? (
              <>
                <ResidentialHighlightsSection
                  data={{
                    // Safely normalize whatever is in `highlights` into the expected residential shape
                    items: Array.isArray(
                      (highlights as ResidentialHighlightsSectionData).items
                    )
                      ? (highlights as ResidentialHighlightsSectionData).items
                      : [],
                  }}
                  onChange={(
                    updatedHighlights: ResidentialHighlightsSectionData
                  ) => setHighlights(updatedHighlights)}
                />
                <ImmersiveTourSection
                  data={immersiveTour}
                  onChange={setImmersiveTour}
                />
              </>
            ) : (
              <>
                <HighlightsSection
                  data={highlights as HighlightsSectionData}
                  onChange={(updatedHighlights: HighlightsSectionData) =>
                    setHighlights(updatedHighlights)
                  }
                />
                <MixSection data={mix} onChange={setMix} />
              </>
            )}
            <AmenitiesSection data={amenities} onChange={setAmenities} />
            <LocationSection data={location} onChange={setLocation} />
            <UnitLayoutSection data={unitLayout} onChange={setUnitLayout} />
            <GallerySection data={gallery} onChange={setGallery} />
            <MediaSection data={media} onChange={setMedia} />
            <FaqSection data={faqs} onChange={setFaqs} />

            {/* SAVE */}
            <div className="mt-10 mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-xl shadow-blue-200/50 border border-blue-300/30">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">
                        Save Changes
                      </h4>
                      <p className="text-blue-100 text-sm">
                        Your updates will be reflected on the live project page.
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <SaveButton onSave={handleSave} loading={loading} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
}

