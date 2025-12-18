import { useState, useRef, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTeamMembers } from "../api/teamApi";
import TeamMemberCard from "./TeamMemberCard";
import Pagination from "./Pagination";
import AddMemberForm from "./AddMember";
import '../styles/components/Directory.scss';

const Directory = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const PAGE_SIZE = 6;

    const addDialogRef = useRef<HTMLDialogElement>(null);

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

    const handleAddSuccess = () => {
        const newTotalPages = Math.ceil((totalCount + 1) / PAGE_SIZE);
        
        // Jump to the new last page
        setPage(newTotalPages);
    };

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
                {openForm && 
                    <AddMemberForm 
                        onClose={() => setOpenForm(false)}
                        onAddSuccess={handleAddSuccess} 
                    />}
            </dialog> 

            <div className="directory__container">
                {members.map((member) => (
                    <TeamMemberCard 
                        key={member.id} 
                        member={member} 
                    />
                ))}
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
};

export default Directory;