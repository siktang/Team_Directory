import type { TeamMember } from "../types/types";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import '../styles/components/TeamMemberCard.scss'

interface Props {
    member: TeamMember;
}

const TeamMemberCard = ({ member }: Props) => {
    const [openModal, setOpenModal] = useState(false);
    
    const bioDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (openModal) {
            bioDialogRef.current?.showModal();
        } else {
            bioDialogRef.current?.close();
        }
    }, [openModal]);

    return (
        <>
        <div className="member-card">
            <h3 className="member-card__item">{member.name}</h3>
            <div className="member-card__buttons">
                <button onClick={() => setOpenModal(true)} className="button__primary">See Bio</button>
                <Link to={`/member/${member.id}`}>
                    <button className="button__primary">More Actions</button>
                </Link>
            </div>
            <p className="member-card__item"><strong>Role:</strong><br/> {member.role}</p>
            <p className="member-card__item"><strong>Email:</strong><br/> {member.email}</p>
        </div>

        {openModal && 
            (<dialog ref={bioDialogRef} className="modal" onClose={() => setOpenModal(false)}>
                <h2>{member.name}</h2>
                <div className="divider"></div>
                <h4>Bio</h4>
                <p>{member.bio}</p>
                <div>
                    <button onClick={() => setOpenModal(false)} className="button__secondary">Close</button>
                </div>
            </dialog>
        )}
        </>
    );
};

export default TeamMemberCard;