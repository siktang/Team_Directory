import type { TeamMember } from "../types/types";

const MEMBERS: TeamMember[] = [
  { id: 1, name: "Alice Johnson", role: "Frontend Dev", email: "alice@company.com", bio: "Loves CSS." },
  { id: 2, name: "Bob Smith", role: "Backend Dev", email: "bob@company.com", bio: "Database wizard." },
  { id: 3, name: "Charlie Davis", role: "Designer", email: "charlie@company.com", bio: "Pixel perfect." },
];

// Simulate an API call with a 500ms delay
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MEMBERS);
    }, 500);
  });
};