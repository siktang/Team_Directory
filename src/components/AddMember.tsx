import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeamMember } from "../api/teamApi"; 
import '../styles/components/AddMember.scss';

const AddMemberForm = ({ onClose }: { onClose: () => void }) => {  
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        email: "",
        bio: "",
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTeamMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
            onClose();
        },
        onError: () => {
            alert("Failed to add member. Is the JSON Server running?");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setFormData({
            name: "",
            role: "",
            email: "",
            bio: "",
        });
        
        onClose();
    };

    return (
        <div>
        <h3>Add New Member</h3>
        <form onSubmit={handleSubmit}>
            <div className="form__input">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" required value={formData.name} onChange={handleChange} />
            </div>
            
            <div className="form__input">
                <label htmlFor="role">Role</label>
                <input id="role" name="role" required value={formData.role} onChange={handleChange} />
            </div>

            <div className="form__input">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>

            <div className="form__input">
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" name="bio" required value={formData.bio} onChange={handleChange} />
            </div>

            <button type="submit" disabled={mutation.isPending} className="button__primary">
                {mutation.isPending ? "Adding..." : "Add Member"}
            </button>
            <button type="button" onClick={handleCancel}>
                Cancel
            </button>
        </form>
        </div>
    );
};

export default AddMemberForm;

