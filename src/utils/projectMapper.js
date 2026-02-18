import fallbackImage from "../assets/images/homthumbnail.png";
import fallbackLogo from "../assets/images/residencelogo1.png";

/**
 * Map a single API project to the shape expected by Projectdetail page.
 * Hero = project_thumbnail, Logo = project_logo.
 */
export const mapProjectDetail = (apiProject, defaults = {}) => {
  if (!apiProject) return defaults;
  return {
    ...defaults,
    title: apiProject.project_name ?? defaults.title,
    brand: defaults.brand ?? "Ameya Group",
    bannerImage: apiProject.project_thumbnail || defaults.bannerImage,
    logo: apiProject.project_logo || defaults.logo,
    about: {
      ...(defaults.about || {}),
      title: apiProject.project_name ?? defaults.about?.title,
      subtitle: defaults.about?.subtitle ?? "OVERVIEW",
      description: defaults.about?.description ?? "",
      image: defaults.about?.image,
    },
    // Keep highlights, categorizedAmenities, floorPlans, location, faqs from defaults
  };
};

/**
 * Parse sections API response: each section has data as JSON string.
 * Returns object keyed by section_type: { hero, overview, highlights, location, ... }.
 */
export const parseSections = (apiSections = []) => {
  const byType = {};
  (apiSections || []).forEach((section) => {
    let data = {};
    if (typeof section.data === "string") {
      try {
        data = JSON.parse(section.data) || {};
      } catch (e) {
        console.error("Error parsing section data:", e, section);
        data = {};
      }
    } else if (section.data && typeof section.data === "object") {
      data = section.data;
    }
    // Store the parsed data without _position to avoid passing it to components
    byType[section.section_type] = { ...data };
  });
  console.log("Parsed sections:", byType);
  return byType;
};

/**
 * Merge parsed sections into the project object used by Projectdetail.
 * hero, overview, highlights, mix, amenities, location, gallery, media, faqs.
 */
export const mergeSectionsIntoProject = (project, sections = {}) => {
  if (!project || !sections) return project;
  const next = { ...project };

  if (sections.hero) {
    const h = sections.hero;
    if (h.background_banner) next.bannerImage = h.background_banner;
    if (h.logo) next.logo = h.logo;
  }

  if (sections.overview) {
    const o = sections.overview;
    next.about = {
      ...(next.about || {}),
      title: o.heading ?? next.about?.title,
      description: o.description ?? next.about?.description,
      image: o.image || next.about?.image,
      subtitle: next.about?.subtitle ?? "OVERVIEW",
    };
  }

  if (sections.highlights) {
    next.highlightsSection = sections.highlights;
  }

  if (sections.mix) {
    next.mixSection = sections.mix;
  }

  if (sections.amenities) {
    next.amenitiesSection = sections.amenities;
  }

  if (sections.location) {
    const loc = sections.location;
    next.location = {
      ...(next.location || {}),
      mapUrl: loc.map_url ?? next.location?.mapUrl,
      locations: Array.isArray(loc.locations) ? loc.locations : next.location?.locations,
    };
  }

  if (sections.gallery) {
    next.gallerySection = sections.gallery;
  }

  if (sections.media) {
    next.mediaSection = sections.media;
  }

  if (sections.faqs) {
    next.faqsSection = sections.faqs;
  }

  if (sections.rera) {
    next.rera = sections.rera.rera;
  }

  return next;
};

export const mapProjects = (apiProjects) => {
  const result = {
    Ongoing: [],
    Completed: [],
  };

  apiProjects.forEach((p) => {
    if (!p.status) return; // skip null status

    const mapped = {
      id: p.id,
      slug: p.slug,
      title: p.project_name,
      subtitle: p.project_name?.toUpperCase(),
      location: `${p.sector}, ${p.city}`,
      logo: p.project_logo || fallbackLogo,
      image: p.project_thumbnail || fallbackImage,
      featured: p.status === "ongoing",
    };

    if (p.status === "ongoing") {
      result.Ongoing.push(mapped);
    }

    if (p.status === "completed") {
      result.Completed.push(mapped);
    }
  });

  return result;
};


