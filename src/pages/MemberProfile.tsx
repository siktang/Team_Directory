import { useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchTeamMemberById, deleteTeamMember } from "../api/teamApi";
import '../styles/pages/MemberProfile.scss';
import deleteIcon from '../assets/images/icons/deleteIcon.png';

const MemberProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const deleteDialogRef = useRef<HTMLDialogElement>(null);

    const openDeleteModal = () => deleteDialogRef.current?.showModal();
    const closeDeleteModal = () => deleteDialogRef.current?.close();

    const { data: member, isLoading, error } = useQuery({
        queryKey: ["member", id],
        queryFn: () => fetchTeamMemberById(id!),
        enabled: !!id, // Only run query if ID exists
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTeamMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
            closeDeleteModal();
            navigate("/"); 
        },
        onError: () => {
            alert("Failed to delete member. Is the server running?");
        }
    });

    const confirmDelete = () => {
        if (id) deleteMutation.mutate(id);
    };

    if (isLoading) return <div>Loading profile...</div>;
    if (error || !member) return <div>Member not found.</div>;

    return (
        <main className="member-profile">
            <Link to="/">
                &larr; Back to Directory
            </Link>

            <div className="member-profile__content">
                <div className="member-profile__header">
                    <h1 data-testid="memberName">{member.name}</h1> 
                    <div onClick={openDeleteModal} data-testid="deleteMember">
                        <img src={deleteIcon} className="icon" alt="delete icon" title="Delete this user"/>
                    </div>
                </div>
                <h3>{member.role}</h3>
                <p><strong>Email:</strong> {member.email}</p>
                <div className="divider"></div>
                <h4>Bio</h4>
                <p>{member.bio}</p>

                <dialog ref={deleteDialogRef} className="modal">
                    <div>
                        <h2>Delete Member?</h2>
                        <p>
                            Are you sure you want to delete <strong>{member.name}</strong>? 
                            This action cannot be undone.
                        </p>
                        
                        <div>
                            <button 
                                data-testid="cancelBtn"
                                onClick={closeDeleteModal}
                                disabled={deleteMutation.isPending}
                                className="button__secondary"
                            >
                                Cancel
                            </button>
                            
                            <button 
                                data-testid="confirmBtn"
                                onClick={confirmDelete} 
                                disabled={deleteMutation.isPending}
                                className="button__danger"
                            >
                                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        </main>
    );
};

export default MemberProfile;