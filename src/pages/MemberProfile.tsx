import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamMemberById } from "../api/teamApi";

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();

  // Use React Query to fetch specific member data
  const { data: member, isLoading, error } = useQuery({
    queryKey: ["member", id],
    queryFn: () => fetchTeamMemberById(id!),
    enabled: !!id, // Only run query if ID exists
  });

  if (isLoading) return <div>Loading profile...</div>;
  if (error || !member) return <div>Member not found.</div>;

  return (
    <div>
      {/* Navigation Breadcrumb */}
      <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
        &larr; Back to Directory
      </Link>

      <div style={{ border: "1px solid #ccc", padding: "2rem", borderRadius: "8px" }}>
        <h1>{member.name}</h1>
        <h3>{member.role}</h3>
        <p><strong>Email:</strong> {member.email}</p>
        <hr />
        <h4>Bio</h4>
        <p>{member.bio}</p>
      </div>
    </div>
  );
};

export default MemberProfile;