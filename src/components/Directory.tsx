import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamMembers } from "../api/teamApi";
import TeamMemberCard from "./TeamMemberCard";
import AddMemberForm from "./AddMember";
import type { TeamMember } from "../types/types";
import '../styles/components/Directory.scss';

const Directory = () => {
    const [search, setSearch] = useState("");
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    const dialogRef = useRef<HTMLDialogElement>(null);

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => dialogRef.current?.close();

    const { data: members, isLoading, error } = useQuery({
        queryKey: ["teamMembers"],
        queryFn: fetchTeamMembers,
    });

    if (isLoading) return <div>Loading team...</div>;
    if (error) return <div>Error loading directory.</div>;

    const filteredMembers = members?.filter((member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="directory">
            <button onClick={openModal}>
            + Add Member
            </button>
            <input
                type="text"
                placeholder="Search by name or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="directory__container">
                {filteredMembers?.map((member) => (
                <TeamMemberCard 
                    key={member.id} 
                    member={member} 
                    onClick={setSelectedMember} 
                />
                ))}
            </div>
            {selectedMember && (
                <dialog open style={{ position: 'fixed', top: '20%', padding: '2rem' }}>
                    <h2>{selectedMember.name}</h2>
                    <p>{selectedMember.bio}</p>
                    <div>
                        <Link to={`/member/${selectedMember.id}`}>
                            <button>See Full Profile</button>
                        </Link>
                        <button onClick={() => setSelectedMember(null)}>Close</button>
                    </div>
                </dialog>
            )}
            <dialog ref={dialogRef}>
        {/* We pass the close function down to the form */}
        <AddMemberForm onClose={closeModal} />
      </dialog>
        </div>
    );
};

export default Directory;