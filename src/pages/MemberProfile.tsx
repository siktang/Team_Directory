import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamMemberById } from "../api/teamApi";
import '../styles/pages/MemberProfile.scss';

const MemberProfile = () => {
    const { id } = useParams<{ id: string }>();

    const { data: member, isLoading, error } = useQuery({
        queryKey: ["member", id],
        queryFn: () => fetchTeamMemberById(id!),
        enabled: !!id, // Only run query if ID exists
    });

    if (isLoading) return <div>Loading profile...</div>;
    if (error || !member) return <div>Member not found.</div>;

    return (
        <main className="member-profile">
            <Link to="/">
                &larr; Back to Directory
            </Link>

            <div className="member-profile__content">
                <h1>{member.name}</h1>
                <h3>{member.role}</h3>
                <p><strong>Email:</strong> {member.email}</p>
                <div className="divider"></div>
                <h4>Bio</h4>
                <p>{member.bio}</p>
            </div>
        </main>
    );
};

export default MemberProfile;