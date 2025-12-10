export interface TeamMember {
    id: number;
    name: string;
    role: string;
    email: string;
    bio?: string; // For the optional details modal
}