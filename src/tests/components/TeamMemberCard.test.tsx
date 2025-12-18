import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TeamMemberCard from '../../components/TeamMemberCard';
import type { TeamMember } from '../../types/types';

const mockMember: TeamMember = {
    id: 1,
    name: "Alice Johnson",
    role: "Frontend Engineer",
    email: "alice@test.com",
    bio: "Loves React testing."
};

describe('TeamMemberCard', () => {
    const renderComponent = () => 
        render(
            <MemoryRouter>
                <TeamMemberCard member={mockMember} />
            </MemoryRouter>
        );

    beforeEach(() => {
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
        vi.clearAllMocks();
        renderComponent();
    });

    it('renders member information correctly', () => {
        expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
        
        expect(screen.getByText(/Frontend Engineer/i)).toBeInTheDocument();
        
        expect(screen.getByText(/alice@test.com/i)).toBeInTheDocument();
    });

    it('opens the bio modal when "See Bio" is clicked', async () => {

        // 1. Ensure Bio is NOT visible initially
        // We use queryByText because getByText throws an error if not found
        expect(screen.queryByText("Loves React testing.")).not.toBeInTheDocument();

        // 2. Click the button
        const bioButton = screen.getByRole('button', { name: /See Bio/i });
        fireEvent.click(bioButton);

        // 3. Verify Modal Appears
        // Note: With conditional rendering, the text appears in the DOM now
        expect(screen.getByText("Loves React testing.")).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: "Alice Johnson", level: 3 })).toBeInTheDocument();
    });

    it('closes the bio modal when "Close" is clicked', async () => {

        // Open it first
        fireEvent.click(screen.getByRole('button', { name: /See Bio/i }));
        
        // Find the Close button inside the modal
        const closeButton = screen.getByRole('button', { name: /Close/i, hidden: true });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText("Loves React testing.")).not.toBeInTheDocument();
        });
    });

    it('has a link to the profile page', () => {
        const link = screen.getByRole('link', { name: /More Actions/i });
        expect(link).toHaveAttribute('href', '/member/1');
    });
});