import type { TeamMember } from "../types/types";
import '../styles/components/TeamMemberCard.scss'

interface Props {
  member: TeamMember;
  onClick: (member: TeamMember) => void;
}

const TeamMemberCard = ({ member, onClick }: Props) => {
  return (
    <div className="member-card" onClick={() => onClick(member)}>
      <h3 className="member-card__item">{member.name}</h3>
      <p className="member-card__item"><strong>Role:</strong><br/> {member.role}</p>
      <p className="member-card__item"><strong>Email:</strong><br/> {member.email}</p>
    </div>
  );
};

export default TeamMemberCard;