import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeamMember } from "../api/teamApi"; 

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

  return (
    <div>
      <h3>Add New Member</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input name="name" required value={formData.name} onChange={handleChange} />
        </div>
        
        <div>
          <label>Role</label>
          <input name="role" required value={formData.role} onChange={handleChange} />
        </div>

        <div>
          <label>Email</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} />
        </div>

        <div>
          <label>Bio</label>
          <textarea name="bio" required value={formData.bio} onChange={handleChange} />
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding..." : "Add Member"}
        </button>
        <button type="button" onClick={onClose}>
            Cancel
        </button>
      </form>
    </div>
  );
};

export default AddMemberForm;

