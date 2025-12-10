import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamMembers } from "../api/mockData";
import TeamMemberCard from "./TeamMemberCard";
import type { TeamMember } from "../types/types";

const Directory = () => {
    const [search, setSearch] = useState("");
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    // Requirement: Use React Query
    const { data: members, isLoading, error } = useQuery({
        queryKey: ["teamMembers"],
        queryFn: fetchTeamMembers,
    });

    if (isLoading) return <div>Loading team...</div>;
    if (error) return <div>Error loading directory.</div>;

    // Requirement: Search/Filter functionality
    const filteredMembers = members?.filter((member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
        <h1>Team Directory</h1>
        
        <input
            type="text"
            placeholder="Search by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <div>
            {filteredMembers?.map((member) => (
            <TeamMemberCard 
                key={member.id} 
                member={member} 
                onClick={setSelectedMember} 
            />
            ))}
        </div>

        {/* Requirement: Optional Modal/Side Panel */}
        {selectedMember && (
            <dialog open style={{ position: 'fixed', top: '20%', padding: '2rem' }}>
            <h2>{selectedMember.name}</h2>
            <p>{selectedMember.bio}</p>
            <button onClick={() => setSelectedMember(null)}>Close</button>
            </dialog>
        )}
        </div>
    );
};

export default Directory;