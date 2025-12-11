import Directory from "../components/Directory";
import { useState } from "react";
import AddMemberForm from "../components/AddMember";

const HomePage = () => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <main>
            <h1 className="header">Team Directory</h1>
            <button onClick={() => setOpenModal(true)}>
            + Add Member
            </button>
            {openModal && (
                <dialog open>
                    <AddMemberForm onClose={() => setOpenModal(false)} />
                </dialog>
            )}
            <Directory />
        </main>
    )
};

export default HomePage;