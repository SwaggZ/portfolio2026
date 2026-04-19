import { useRef } from "react";
import { getResumeData } from "../resume/getResumeData";

/**
 * Returns resume data (with default limits) and a ref for the page element.
 * One-page fit is handled purely by print CSS + content limits in getResumeData.
 */
export default function useAutoFitResume() {
  const pageRef = useRef(null);
  const data = getResumeData();
  return { pageRef, data };
}
