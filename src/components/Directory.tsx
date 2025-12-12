import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamMembers } from "../api/teamApi";
import TeamMemberCard from "./TeamMemberCard";
import { Pagination } from "./Pagination";
import type { TeamMember } from "../types/types";
import '../styles/components/Directory.scss';

const Directory = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const PAGE_SIZE = 6;

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (selectedMember) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [selectedMember]);

    const { data: allMembers = [], isLoading, error } = useQuery({
        queryKey: ["teamMembers"],
        queryFn: fetchTeamMembers,
    });

    const { currentSlice, totalPages } = useMemo(() => {
        const filteredMembers = allMembers.filter((member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase())
    );

        // 2. Calculate Math
        const total = filteredMembers.length;
        const pages = Math.ceil(total / PAGE_SIZE);
        
        // Safety: Ensure page isn't out of bounds
        const safePage = Math.min(page, pages) || 1; 

        // 3. Slice
        const start = (safePage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        return { 
            currentSlice: filteredMembers.slice(start, end), 
            totalPages: pages,
            safePage // Return this so we can sync state if needed
        };
    }, [allMembers, search, page]);

    // Sync safe page back to state if it changed during calculation
    // (Prevents being stuck on Page 5 when search results only have 1 page)
    if (page !== 1 && page > totalPages && totalPages > 0) {
        setPage(1); 
    }
    // ---------------------

    if (isLoading) return <div>Loading team...</div>;
    //To-do: update error to use data response
    if (error) return <div>Error loading directory.</div>;

    return (
        <div className="directory">
            <input
                type="text"
                placeholder="Search by name or role"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="directory__container">
                {currentSlice.map((member) => (
                <TeamMemberCard 
                    key={member.id} 
                    member={member} 
                    onClick={setSelectedMember} 
                />
                ))}
            </div>
            {selectedMember && (
                <dialog ref={dialogRef}>
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
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
};

export default Directory;