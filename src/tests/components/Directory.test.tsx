import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Directory from '../../components/Directory';
import { fetchTeamMembers} from '../../api/teamApi';

vi.mock('../../api/teamApi');

const mockMembers = Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    name: `Member ${i + 1}`,
    role: i === 0 ? "Manager" : "Developer", 
    email: `member${i + 1}@test.com`,
    bio: `Bio for member ${i + 1}`
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
        queries: {
            retry: false, // Turn off retries for tests
        },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </QueryClientProvider>
    );
};

describe('Directory', () => {
  
    beforeEach(() => {
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
        vi.clearAllMocks();
    });

    it('shows loading state initially', () => {
        vi.mocked(fetchTeamMembers).mockImplementation(() => new Promise(() => {}));
        
        render(<Directory />, { wrapper: createWrapper() });
        expect(screen.getByText('Loading team...')).toBeInTheDocument();
    });

    it('renders members after loading', async () => {
        vi.mocked(fetchTeamMembers).mockResolvedValue(mockMembers);

        render(<Directory />, { wrapper: createWrapper() });

        await waitFor(() => {
        expect(screen.getByText('Member 1')).toBeInTheDocument();
        });
        
        expect(screen.getByText('Member 6')).toBeInTheDocument();
        
        expect(screen.queryByText('Member 7')).not.toBeInTheDocument();
    });

    it('filters members when searching', async () => {
        vi.mocked(fetchTeamMembers).mockResolvedValue(mockMembers);
        render(<Directory />, { wrapper: createWrapper() });

        await waitFor(() => expect(screen.getByText('Member 1')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText(/search by name/i);

        fireEvent.change(searchInput, { target: { value: 'Manager' } });

        expect(screen.getByText('Member 1')).toBeInTheDocument();
        expect(screen.queryByText('Member 2')).not.toBeInTheDocument();
    });

    it('paginates correctly', async () => {
        vi.mocked(fetchTeamMembers).mockResolvedValue(mockMembers);
        render(<Directory />, { wrapper: createWrapper() });

        await waitFor(() => expect(screen.getByText('Member 1')).toBeInTheDocument());

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(screen.getByText('Member 7')).toBeInTheDocument();
        expect(screen.queryByText('Member 1')).not.toBeInTheDocument();
    });

    it('opens and closes the modal', async () => {
        vi.mocked(fetchTeamMembers).mockResolvedValue(mockMembers);
        render(<Directory />, { wrapper: createWrapper() });

        await waitFor(() => expect(screen.getByText('Member 1')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Member 1'));

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

        expect(screen.getByText('Bio for member 1')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Close'));

        expect(screen.queryByText("Bio for member 1")).not.toBeInTheDocument()
    });

    it('shows error state when fetch fails', async () => {
        vi.mocked(fetchTeamMembers).mockRejectedValue(new Error('Failed'));
        
        render(<Directory />, { wrapper: createWrapper() });

        await waitFor(() => {
        expect(screen.getByText('Error loading directory.')).toBeInTheDocument();
        });
    });
});
