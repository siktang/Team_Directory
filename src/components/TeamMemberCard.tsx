import type { TeamMember } from "../types/types";

interface Props {
  member: TeamMember;
  onClick: (member: TeamMember) => void;
}

const TeamMemberCard = ({ member, onClick }: Props) => {
  return (
    <div onClick={() => onClick(member)}>
      <h3>{member.name}</h3>
      <p><strong>Role:</strong> {member.role}</p>
      <p><strong>Email:</strong> {member.email}</p>
    </div>
  );
};

export default TeamMemberCard;