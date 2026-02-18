export const mapProjectSections = (sections = []) => {
  const project = {};

  // ensure correct order
  sections
    .sort((a, b) => a.position - b.position)
    .forEach((section) => {
      const data = JSON.parse(section.data);

      switch (section.section_type) {
        case "hero":
          project.bannerImage = data.background_banner;
          project.logo = data.logo;
          break;

        case "overview":
          project.about = {
            title: data.heading,
            subtitle: "OVERVIEW",
            description: data.description,
            image: data.image,
          };
          break;

        case "highlights":
          project.highlights = data.highlights;
          project.highlightMeta = {
            size: data.size,
            type: data.type,
            description: data.description,
            image: data.image,
          };
          break;

        case "mix":
          project.mix = data.items;
          break;

        case "amenities":
          project.amenities = data.items;
          break;

        case "location":
          project.location = {
            mapUrl: data.map_url,
            connectivity: data.locations,
          };
          break;

        case "gallery":
          project.gallery = data.images;
          break;

        case "media":
          project.media = data.items;
          break;

        case "faqs":
          project.faqs = data.items;
          break;

        default:
          break;
      }
    });

  return project;
};
