import type { TeamMember } from "../types/types";

const BASE_URL = "http://localhost:3000/members";

// 1. Fetch All Members
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch members");
  return response.json();
};

// 2. Fetch Single Member
export const fetchTeamMemberById = async (id: string): Promise<TeamMember> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Member not found");
  return response.json();
};

// 3. Create Member
// Note: JSON Server automatically handles ID generation!
export const createTeamMember = async (newMember: Omit<TeamMember, "id">): Promise<TeamMember> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMember),
  });
  
  if (!response.ok) throw new Error("Failed to create member");
  return response.json();
};