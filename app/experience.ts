export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  date: string;
  selfDirected?: boolean;
}

// Order: incoming > ongoing ("Since ...") > ended, newest first.
// Dates must fit the 11rem rail (cross-year ranges overflow).
// selfDirected wraps the company in dim parens.
export const experience: ExperienceEntry[] = [
  {
    id: "optiver-qt-intern-2027",
    role: "Incoming Quantitative Trading Intern",
    company: "Optiver",
    date: "2027",
  },
  {
    id: "independent-trading",
    role: "Research & Trading, Prediction Markets",
    company: "Independent",
    date: "Since Nov 2025",
    selfDirected: true,
  },
  {
    id: "citi-swe-intern-2026",
    role: "Software Engineering Intern",
    company: "Citi",
    date: "Jun - Aug 2026",
  },
];
