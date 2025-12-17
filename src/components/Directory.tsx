import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTeamMembers } from "../api/teamApi";
import TeamMemberCard from "./TeamMemberCard";
import Pagination from "./Pagination";
import AddMemberForm from "./AddMember";
import type { TeamMember } from "../types/types";
import '../styles/components/Directory.scss';

const Directory = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [openForm, setOpenForm] = useState(false);
    const PAGE_SIZE = 6;

    const viewDialogRef = useRef<HTMLDialogElement>(null);
    const addDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (selectedMember) {
            viewDialogRef.current?.showModal();
        } else {
            viewDialogRef.current?.close();
        }
    }, [selectedMember]);

    useEffect(() => {
        if (openForm) {
            addDialogRef.current?.showModal();
        } else {
            addDialogRef.current?.close();
        }
    }, [openForm]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["members", page, search], 
        
        queryFn: () => fetchTeamMembers(page, PAGE_SIZE, search),
        
        // Keeps the old data on screen while fetching the new page
        placeholderData: keepPreviousData, 
    });

    const members = data?.data || [];
    const totalCount = data?.total || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    if (isLoading) return <div>Loading team...</div>;
    if (isError) return <div>Error loading directory.</div>;

    return (
        <div className="directory">
            <div className="directory__top-buttons">
                <div>
                    <input
                        id="search"
                        data-testid="searchBox"
                        type="text"
                        placeholder="Search by name or role"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div>
                    <button onClick={() => setOpenForm(true)} className="button__primary button__mobile">
                        Add
                    </button>
                    <button onClick={() => setOpenForm(true)} className="button__primary button__tablet">
                        + Add Member
                    </button>
                </div>
            </div>
            <dialog ref={addDialogRef} className="modal">
                {openForm && <AddMemberForm onClose={() => setOpenForm(false)} />}
            </dialog> 

            <div className="directory__container">
                {members.map((member) => (
                    <TeamMemberCard 
                        key={member.id} 
                        member={member} 
                        onClick={setSelectedMember} 
                    />
                ))}
            </div>
            {selectedMember && (
                <dialog ref={viewDialogRef} className="modal">
                    <h2>{selectedMember.name}</h2>
                    <div className="divider"></div>
                    <h4>Bio</h4>
                    <p>{selectedMember.bio}</p>
                    <div>
                        <Link to={`/member/${selectedMember.id}`}>
                            <button className="button__primary">More Actions</button>
                        </Link>
                        <button onClick={() => setSelectedMember(null)} className="button__secondary">Close</button>
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