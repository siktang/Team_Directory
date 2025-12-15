import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    const handleClick = vi.fn();

    const renderComponent = () => 
        render(<TeamMemberCard member={mockMember} onClick={handleClick} />);

    beforeEach(() => {
        renderComponent();
    });

    it('renders member information correctly', () => {
        expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
        
        expect(screen.getByText(/Frontend Engineer/i)).toBeInTheDocument();
        
        expect(screen.getByText(/alice@test.com/i)).toBeInTheDocument();
    });

    it('calls onClick with the correct member when clicked', () => {
        const card = screen.getByText("Alice Johnson").closest('div');
        if (card) {
            fireEvent.click(card);
        }

        expect(handleClick).toHaveBeenCalledTimes(1);

        expect(handleClick).toHaveBeenCalledWith(mockMember);
    });
});