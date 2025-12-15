import type { TeamMember } from "../types/types";

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch All Members
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch members");
    return response.json();
};

// Fetch Single Member
export const fetchTeamMemberById = async (id: string): Promise<TeamMember> => {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Member not found");
    return response.json();
};

// Create Member
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

// Delete Member
export const deleteTeamMember = async (id: number | string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error("Failed to delete member");
    }
};