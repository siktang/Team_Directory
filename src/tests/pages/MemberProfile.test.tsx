import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MemberProfile from '../../pages/MemberProfile'; 
import { fetchTeamMemberById } from '../../api/teamApi';
import type { Mock } from 'vitest';

vi.mock('../../api/teamApi', () => ({
    fetchTeamMemberById: vi.fn(),
}));

const mockMember = {
    id: "99",
    name: "Sarah Connor",
    role: "Security Lead",
    email: "sarah@skynet.com",
    bio: "No fate but what we make."
};

const renderWithRouter = (memberId = "99") => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[`/member/${memberId}`]}>
                <Routes>
                  <Route path="/member/:id" element={<MemberProfile />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('MemberProfile Page', () => {
    it('shows loading state initially', () => {
        (fetchTeamMemberById as Mock).mockImplementation(() => new Promise(() => {}));

        renderWithRouter("99");

        expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    });

    it('renders member details on success', async () => {
        (fetchTeamMemberById as Mock).mockResolvedValue(mockMember);

        renderWithRouter("99");

        await waitFor(() => {
          expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
        });

        expect(screen.getByText('Security Lead')).toBeInTheDocument();
        expect(screen.getByText('sarah@skynet.com')).toBeInTheDocument();
        expect(screen.getByText('No fate but what we make.')).toBeInTheDocument();

        expect(fetchTeamMemberById).toHaveBeenCalledWith("99");
    });

    it('shows error message if member not found or API fails', async () => {
        (fetchTeamMemberById as Mock).mockRejectedValue(new Error('Not Found'));

        renderWithRouter("99");

        await waitFor(() => {
          expect(screen.getByText('Member not found.')).toBeInTheDocument();
        });
    });

    it('renders a link back to the directory', async () => {
        (fetchTeamMemberById as Mock).mockResolvedValue(mockMember);
        
        renderWithRouter("99");

        await waitFor(() => expect(screen.getByText('Sarah Connor')).toBeInTheDocument());

        const backLink = screen.getByText(/Back to Directory/i);
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });
});