import type { TeamMember } from "../types/types";
import '../styles/components/TeamMemberCard.scss'

interface Props {
  member: TeamMember;
  onClick: (member: TeamMember) => void;
}

const TeamMemberCard = ({ member, onClick }: Props) => {
  return (
    <div className="member-card" onClick={() => onClick(member)}>
      <h3>{member.name}</h3>
      <p><strong>Role:</strong> {member.role}</p>
      <p><strong>Email:</strong> {member.email}</p>
    </div>
  );
};

export default TeamMemberCard;