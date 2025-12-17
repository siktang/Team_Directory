import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeamMember } from "../api/teamApi"; 
import '../styles/components/AddMember.scss';

const AddMemberForm = ({ onClose }: { onClose: () => void }) => {  
    const INITIAL_STATE = {
        name: "",
        role: "",
        email: "",
        bio: "",
    };
    
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [submitClicked, setSubmitClicked] = useState(false);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTeamMember,
       
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teamMembers"] });

            setFormData(INITIAL_STATE);
            setSubmitClicked(false);
            onClose();
        },
        onError: () => {
            alert("Failed to add member. Is the JSON Server running?");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitClicked(true);

        if (
            !formData.email ||
            !formData.name ||
            !formData.role ||
            !formData.bio
        ) {
            return;
        }

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
            <form onSubmit={handleSubmit} noValidate>
                <div className="form__input">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" required value={formData.name} onChange={handleChange} />
                </div>
                {formData.name === "" && submitClicked && 
                    <div className="error-field">
                        This field is required!
                    </div>
                }
                
                <div className="form__input">
                    <label htmlFor="role">Role</label>
                    <input id="role" name="role" required value={formData.role} onChange={handleChange} />    
                </div>
                {formData.role === "" && submitClicked && 
                    <div className="error-field">
                        This field is required!
                    </div>
                }

                <div className="form__input">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} />
                </div>
                {formData.email === "" && submitClicked && 
                    <div className="error-field">
                        This field is required!
                    </div>
                }

                <div className="form__input">
                    <label htmlFor="bio">Bio</label>
                    <textarea id="bio" name="bio" required value={formData.bio} onChange={handleChange} />
                </div>
                {formData.bio === "" && submitClicked && 
                    <div className="error-field">
                        This field is required!
                    </div>
                }

                {mutation.isPending ?  (
                    <button className="button button__disabled" disabled>
                        Submitting...
                    </button>
                )
                : (
                    <button data-testid="add-member" type="submit" className="button button__primary">
                        Add
                    </button>
                )}
                <button data-testid="cancel" type="button" onClick={handleCancel} className="button button__secondary">
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddMemberForm;

