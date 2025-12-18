import type { TeamMember } from "../types/types";

const BASE_URL = import.meta.env.VITE_API_URL;

interface FetchResponse {
    data: TeamMember[];
    total: number;
}

// Fetch All Members (server-side pagination)
export const fetchTeamMembers = async (page: number, limit: number, search: string=""): Promise<FetchResponse> => {
    const response = await fetch(`${BASE_URL}?_page=${page}&_limit=${limit}&q=${search}`);
    
    if (!response.ok) throw new Error("Failed to fetch members");

    const data = await response.json();

    const total = Number(response.headers.get('X-Total-Count') || 0);

    return { data, total };
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

// Update Member
export const updateTeamMember = async (id: number | string, updates: Partial<TeamMember>) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH', 
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error("Failed to update member");
    return response.json();
};