import type { ResidentialFaqSectionData } from "../../types/project.types";
import FaqSection from "../FaqSection";

interface Props {
  data: ResidentialFaqSectionData;
  onChange: (data: ResidentialFaqSectionData) => void;
}

// Thin wrapper reusing the generic FAQ section for residential projects
export default function ResidentialFaqSection({ data, onChange }: Props) {
  return <FaqSection data={data} onChange={onChange} />;
}

