import Directory from "../components/Directory";
import { useRef } from "react";
import AddMemberForm from "../components/AddMember";

const HomePage = () => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => dialogRef.current?.close();


    return (
        <main>
            <h1 className="header">Team Directory</h1>
            <button onClick={openModal}>
            + Add Member
            </button>
            <dialog ref={dialogRef}>
                <AddMemberForm onClose={closeModal} />
            </dialog>            
            <Directory />
        </main>
    )
};

export default HomePage;