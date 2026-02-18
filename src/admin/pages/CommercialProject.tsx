import { useState } from "react";
import { uploadSingleImage } from "../../services/upload";
import HeroSection from "../components/HeroSection";
import OverviewSection from "../components/OverviewSection";
import HighlightsSection from "../components/HighlightsSection";
import MixSection from "../components/MixSection";
import AmenitiesSection from "../components/AmenitiesSection";
import SaveButton from "../components/SaveButton";
import AdminSidebar from "../components/AdminSidebar";
import LocationSection from "../components/LocationSection";
import GallerySection from "../components/GallerySection";
import MediaSection from "../components/MediaSection";
import FaqSection from "../components/FaqSection";
import UnitLayoutSection from "../components/residential/UnitLayoutSection";
import { createProject, addSection } from "../../services/api";
import "../styles/commercial.css"
import AdminFooter from "../components/AdminFooter";


import {
  type HeroSectionData,
  type ProjectMeta,
  type OverviewSectionData,
  type HighlightsSectionData,
  type MixSectionData,
  type AmenitiesSectionData,
  type LocationSectionData,
  type GallerySectionData,
  type MediaSectionData,
  type FaqSectionData,
  type ReraSectionData,
  type UnitLayoutSectionData,
} from "../types/project.types";

export default function CommercialProject() {
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  const [project, setProject] = useState<ProjectMeta>({
    slug: "",
    project_name: "",
    status: "ongoing",
    sector: "",
    city: "",
    project_type: "commercial",
    project_logo: "",
    project_thumbnail: ""

  });



  const uploadProjectLogo = async (file: File) => {
    const url = await uploadSingleImage("logo", file);
    setProject((prev) => ({
      ...prev,
      project_logo: url
    }));
  };
  
  const uploadProjectThumbnail = async (file: File) => {
    const url = await uploadSingleImage("thumbnail", file);
    setProject((prev) => ({
      ...prev,
      project_thumbnail: url
    }));
  };
  

  const [hero, setHero] = useState<HeroSectionData>({
    logo: "",
    background_banner: ""
  });

  const [overview, setOverview] = useState<OverviewSectionData>({
    heading: "",
    description: "",
    image: "",
    images: []
  });

  const [highlights, setHighlights] = useState<HighlightsSectionData>({
    highlights: [],
    image: "",
    size: "",
    type: "",
    description: ""
  });

  const [mix, setMix] = useState<MixSectionData>({
    items: []
  });

  const [amenities, setAmenities] = useState<AmenitiesSectionData>({
    items: []
  });

  const [location, setLocation] = useState<LocationSectionData>({
    locations: [],
    map_url: ""
  });

  const [gallery, setGallery] = useState<GallerySectionData>({
    images: []
  });

  const [media, setMedia] = useState<MediaSectionData>({
    items: []
  });

  const [faqs, setFaqs] = useState<FaqSectionData>({
    items: []
  });

  const [rera, setRera] = useState<ReraSectionData>({
    rera: ""
  });

  const [unitLayout, setUnitLayout] = useState<UnitLayoutSectionData>({
    items: []
  });


  // Auto-generate slug from project name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const saveToDatabase = async () => {
    try {
      if (!project.slug || !project.project_name) {
        alert("Project details required");
        return;
      }

      if (!hero.logo || !hero.background_banner) {
        alert("Upload hero images first");
        return;
      }

      setLoading(true);

      let id = projectId;

      // CREATE PROJECT (ONLY ONCE)
      if (!id) {
        const res = await createProject(project);
        id = res.id;
        setProjectId(id);
      }

      // HERO
      await addSection({
        project_id: id!,
        section_type: "hero",
        position: 1,
        data: hero
      });

      // OVERVIEW
      if (overview.heading || overview.description || overview.image || (overview.images && overview.images.length > 0)) {
        await addSection({
          project_id: id!,
          section_type: "overview",
          position: 2,
          data: overview
        });
      }
      if (
        highlights.highlights.length > 0 ||
        highlights.image ||
        highlights.size ||
        highlights.type ||
        highlights.description
      ) {
        await addSection({
          project_id: id!,
          section_type: "highlights",
          position: 3,
          data: highlights
        });
      }
      // SAVE THE MIX SECTION
      if (mix.items.length > 0) {
        await addSection({
          project_id: id!,
          section_type: "mix",
          position: 4,
          data: mix
        });
      }

      // SAVE AMENITIES
      if (amenities.items.length > 0) {
        await addSection({
          project_id: id!,
          section_type: "amenities",
          position: 5,
          data: amenities
        });
      }

      // SAVE LOCATION ADVANTAGE
      if (location.locations.length > 0 || location.map_url) {
        await addSection({
          project_id: id!,
          section_type: "location",
          position: 6,
          data: location
        });
      }

      // SAVE GALLERY
      if (gallery.images.length > 0) {
        await addSection({
          project_id: id!,
          section_type: "gallery",
          position: 7,
          data: gallery
        });
      }

      // SAVE MEDIA URL SECTION
      if (media.items.filter(i => i.url).length > 0) {
        await addSection({
          project_id: id!,
          section_type: "media",
          position: 8,
          data: {
            items: media.items.filter(i => i.url)
          }
        });
      }

      // SAVE FAQ SECTION
      if (faqs.items.length > 0) {
        await addSection({
          project_id: id!,
          section_type: "faqs",
          position: 9,
          data: faqs
        });
      }

      // SAVE RERA DETAILS
      if (rera.rera) {
        await addSection({
          project_id: id!,
          section_type: "rera",
          position: 10,
          data: rera
        });
      }

      // SAVE UNIT LAYOUT (for commercial)
      if (unitLayout.items.length > 0) {
        await addSection({
          project_id: id!,
          section_type: "unit_layout",
          position: 11,
          data: unitLayout
        });
      }



      alert("Project saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

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
                  Commercial Project Management
                </h2>
              </div>
              <p className="text-gray-600 mt-2 text-lg ml-4">
                Create and manage commercial real estate projects. Fill in the details below to publish a new project.
              </p>
            </div>

            {/* PROJECT META */}
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">
                  Project Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    value={project.project_name}
                    onChange={(e) => {
                      const projectName = e.target.value;
                      const autoSlug = projectName ? generateSlug(projectName) : '';
                      setProject({
                        ...project,
                        project_name: projectName,
                        slug: autoSlug
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                  />
                  {project.slug && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Auto-generated slug: <span className="font-mono text-blue-600">{project.slug}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status
                  </label>
                  <select
                    value={project.status}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        status: e.target.value as "ongoing" | "completed"
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white shadow-sm hover:shadow-md"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <input
                placeholder="Sector (e.g. Sector 65)"
                value={project.sector}
                onChange={(e) =>
                  setProject({ ...project, sector: e.target.value })
                }
              />

              <input
                placeholder="City (e.g. Gurugram)"
                value={project.city}
                onChange={(e) =>
                  setProject({ ...project, city: e.target.value })
                }
              />

              {/* RERA Number */}
              <input
                placeholder="RERA Number"
                value={rera.rera}
                onChange={(e) =>
                  setRera({ rera: e.target.value })
                }
                style={{ marginTop: 12 }}
              />


              {/* PROJECT LOGO */}
<div style={{ marginBottom: 16 }}>
  <label style={{ fontWeight: 600 }}>Project Logo</label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      e.target.files &&
      uploadProjectLogo(e.target.files[0])
    }
  />

  {project.project_logo && (
    <div style={{ marginTop: 8 }}>
      <img
        src={project.project_logo}
        alt="Project Logo"
        style={{
          height: 80,
          objectFit: "contain",
          border: "1px solid #ddd",
          padding: 6
        }}
      />
    </div>
  )}
</div>

{/* PROJECT THUMBNAIL */}
<div style={{ marginBottom: 16 }}>
  <label style={{ fontWeight: 600 }}>
    Project Thumbnail
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      e.target.files &&
      uploadProjectThumbnail(e.target.files[0])
    }
  />

  {project.project_thumbnail && (
    <div style={{ marginTop: 8 }}>
      <img
        src={project.project_thumbnail}
        alt="Project Thumbnail"
        style={{
          width: 160,
          height: 100,
          objectFit: "cover",
          border: "1px solid #ddd",
          borderRadius: 4
        }}
      />
    </div>
  )}
</div>


            </div>

            {/* HERO */}
            <HeroSection data={hero} onChange={setHero} />

            {/* OVERVIEW */}
            <OverviewSection data={overview} onChange={setOverview} />

            <HighlightsSection
              data={highlights}
              onChange={setHighlights}
            />

            <MixSection data={mix} onChange={setMix} />

            <AmenitiesSection
              data={amenities}
              onChange={setAmenities}
            />

            <LocationSection
              data={location}
              onChange={setLocation}
            />

            {/* UNIT LAYOUT */}
            <UnitLayoutSection
              data={unitLayout}
              onChange={setUnitLayout}
            />

            <GallerySection
              data={gallery}
              onChange={setGallery}
            />

            <MediaSection
              data={media}
              onChange={setMedia}
            />


            <FaqSection
              data={faqs}
              onChange={setFaqs}
            />


            {/* SAVE */}
            <div className="mt-10 mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-xl shadow-blue-200/50 border border-blue-300/30">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">Ready to Publish?</h4>
                      <p className="text-blue-100 text-sm">Save your project to make it live on the website</p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <SaveButton onSave={saveToDatabase} loading={loading} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
      <AdminFooter></AdminFooter>

    </>

  );
}
