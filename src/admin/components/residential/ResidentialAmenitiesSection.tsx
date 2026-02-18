import type { ResidentialAmenitiesSectionData } from "../../types/project.types";
import AmenitiesSection from "../AmenitiesSection";

interface Props {
  data: ResidentialAmenitiesSectionData;
  onChange: (data: ResidentialAmenitiesSectionData) => void;
}

// Thin wrapper around the generic AmenitiesSection for residential projects
export default function ResidentialAmenitiesSection({ data, onChange }: Props) {
  return <AmenitiesSection data={data} onChange={onChange} />;
}

