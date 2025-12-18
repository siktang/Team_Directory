import { useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchTeamMemberById, deleteTeamMember, updateTeamMember } from "../api/teamApi";
import '../styles/pages/MemberProfile.scss';
import deleteIcon from '../assets/images/icons/deleteIcon.png';
import editIcon from '../assets/images/icons/editIcon.svg';

const MemberProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isEditting, setIsEditting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        email: "",
        bio: ""
    });
    const [submitClicked, setSubmitClicked] = useState(false);

    const deleteDialogRef = useRef<HTMLDialogElement>(null);

    const openDeleteModal = () => deleteDialogRef.current?.showModal();
    const closeDeleteModal = () => deleteDialogRef.current?.close();

    const { data: member, isLoading, error } = useQuery({
        queryKey: ["member", id],
        queryFn: () => fetchTeamMemberById(id!),
        enabled: !!id, // Only run query if ID exists
    });

    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name,
                role: member.role,
                email: member.email,
                bio: member.bio || ""
            });
        }
    }, [member]);

    const updateMutation = useMutation({
        mutationFn: () => updateTeamMember(id!, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["member", id] });
            queryClient.invalidateQueries({ queryKey: ["teamMembers"] }); // Update directory too
            setIsEditting(false); // Switch back to "View Mode"
            setSubmitClicked(false);
        },
        onError: () => alert("Failed to save changes.")
    });

    const confirmDelete = () => {
        if (id) deleteMutation.mutate(id);
    };

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

    const handleSave = () => {

        setSubmitClicked(true);

        if (
            !formData.email ||
            !formData.name ||
            !formData.role ||
            !formData.bio
        ) {
            return;
        }

        updateMutation.mutate();
    };
    
    const handleCancel = () => {
        // Reset form data back to original server data
        if (member) {
            setFormData({
                name: member.name,
                role: member.role,
                email: member.email,
                bio: member.bio || ""
            });
        }
        setIsEditting(false);
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

                    {isEditting ? (
                        <>
                            <label htmlFor="name"><strong>Name:</strong></label>
                            <input
                                id="name"
                                name="name" 
                                className="input__large"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            {formData.name === "" && submitClicked && 
                                <div className="error-field">
                                    This field is required!
                                </div>
                            }
                        </>
                    ) : (
                        <h1 data-testid="memberName">{member.name}</h1>
                    )}

                    
                        {isEditting ? null : (
                            <div className="icons__header">
                                <div onClick={() => setIsEditting(true)} style={{cursor: 'pointer'}}>
                                    <img src={editIcon} className="icon" alt="edit" title="Edit this profile"/>
                                </div>
                                <div onClick={openDeleteModal} data-testid="deleteMember">
                                    <img src={deleteIcon} className="icon" alt="delete icon" title="Delete this member"/>
                                </div>
                            </div> 
                        )}                 
                </div>
                
                <div className="divider"></div>
                
                {isEditting ? (
                    <>
                        <label htmlFor="role"><strong>Role:</strong></label>
                        <input
                            id="role"
                            name="role" 
                            className="input__medium"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        />
                        {formData.role === "" && submitClicked && 
                            <div className="error-field">
                                This field is required!
                            </div>
                        }
                    </>
                ) : (
                    <h3>{member.role}</h3>
                )}

                <p><strong>Email:</strong>
                    {isEditting ? (
                        <>
                            <input 
                                id="email"
                                name="email"
                                aria-label="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            {formData.email === "" && submitClicked && 
                                <div className="error-field">
                                    This field is required!
                                </div>
                            }
                        </>
                    ) : (
                        ` ${member.email}`
                    )}
                </p>
                
                <h4>Bio</h4>
                {isEditting ? (
                    <div>
                        <textarea
                            id="bio"
                            name="bio"
                            aria-label="bio" 
                            className="input__area"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            rows={5}
                        />
                        {formData.bio === "" && submitClicked && 
                            <div className="error-field">
                                This field is required!
                            </div>
                        }
                    </div>
                ) : (
                    <p>{member.bio}</p>
                )}

                
                {isEditting ? (
                    <>
                        <button onClick={handleSave} disabled={updateMutation.isPending} className="button__primary">
                            {updateMutation.isPending? "Saving..." : "Save"}
                        </button>
                        <button onClick={handleCancel} className="button__secondary">Cancel</button>
                    </>
                ) : 
                    null
                }

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