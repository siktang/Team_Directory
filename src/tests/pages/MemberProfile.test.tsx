import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MemberProfile from '../../pages/MemberProfile'; 
import { fetchTeamMemberById, deleteTeamMember } from '../../api/teamApi';
import type { Mock } from 'vitest';

vi.mock('../../api/teamApi');
vi.mock('../assets/images/icons/deleteIcon.png', () => ({ default: 'mock-icon.png' }));

const mockMember = {
    id: "99",
    name: "Sarah Connor",
    role: "Security Lead",
    email: "sarah@skynet.com",
    bio: "No fate but what we make."
};

const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async (importOriginal) => {
        const actual = await importOriginal<typeof import('react-router-dom')>();
        return {
            ...actual,
            useNavigate: () => mockNavigate,
    };
});

describe('MemberProfile Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
        (fetchTeamMemberById as Mock).mockResolvedValue(mockMember);
    });

    const renderWithRouter = (memberId = '99') => {
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

    it('shows loading state initially', () => {
        (fetchTeamMemberById as Mock).mockImplementation(() => new Promise(() => {}));

        renderWithRouter('99');

        expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    });

    it('renders member details on success', async () => {
        (fetchTeamMemberById as Mock).mockResolvedValue(mockMember);

        renderWithRouter('99');

        await waitFor(() => {
          expect(screen.getByTestId('memberName')).toBeInTheDocument();
        });

        expect(screen.getByText('Security Lead')).toBeInTheDocument();
        expect(screen.getByText('sarah@skynet.com')).toBeInTheDocument();
        expect(screen.getByText('No fate but what we make.')).toBeInTheDocument();

        expect(fetchTeamMemberById).toHaveBeenCalledWith("99");
    });

    it('shows error message if member not found or API fails', async () => {
        (fetchTeamMemberById as Mock).mockRejectedValue(new Error('Not Found'));

        renderWithRouter('99');

        await waitFor(() => {
          expect(screen.getByText('Member not found.')).toBeInTheDocument();
        });
    });

    it('renders a link back to the directory', async () => {
        (fetchTeamMemberById as Mock).mockResolvedValue(mockMember);
        
        renderWithRouter('99');

        await waitFor(() => expect(screen.getByTestId('memberName')).toBeInTheDocument());

        const backLink = screen.getByText(/Back to Directory/i);
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('opens the confirmation modal when delete icon is clicked', async () => {
        renderWithRouter('99');;
        await waitFor(() => expect(screen.getByTestId('memberName')).toBeInTheDocument());

        const deleteIcon = screen.getByTestId('deleteMember');
        
        fireEvent.click(deleteIcon);

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it('closes the modal when Cancel is clicked', async () => {
        renderWithRouter('99');;
        await waitFor(() => expect(screen.getByTestId('memberName')).toBeInTheDocument());

        fireEvent.click(screen.getByTestId('deleteMember'));

        const cancelBtn = screen.getByTestId('cancelBtn');
        fireEvent.click(cancelBtn);

        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        expect(deleteTeamMember).not.toHaveBeenCalled();
    });

    it('calls delete API and navigates home on confirmation', async () => {
        (deleteTeamMember as Mock).mockResolvedValue({});

        renderWithRouter('99');;
        await waitFor(() => expect(screen.getByTestId('memberName')).toBeInTheDocument());

        fireEvent.click(screen.getByTestId('deleteMember'));

        const confirmBtn = screen.getByTestId('confirmBtn');
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(deleteTeamMember).toHaveBeenCalledWith(
                '99',
                expect.anything()
            );
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
        
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it('shows alert if deletion fails', async () => {
        (deleteTeamMember as Mock).mockRejectedValue(new Error('Server Error'));
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

        renderWithRouter('99');;
        await waitFor(() => expect(screen.getByTestId('memberName')).toBeInTheDocument());

        fireEvent.click(screen.getByTestId('deleteMember'));
        fireEvent.click(screen.getByTestId('confirmBtn'));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Failed'));
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});