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
                retry: false, 
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
        vi.mocked(fetchTeamMembers).mockResolvedValue({
            data: mockMembers.slice(0, 6), // Simulate Page 1
            total: mockMembers.length      // Real total (7)
        });

        render(<Directory />, { wrapper: createWrapper() });

        await waitFor(() => {
        expect(screen.getByText('Member 1')).toBeInTheDocument();
        });
        
        expect(screen.getByText('Member 6')).toBeInTheDocument();
        
        expect(screen.queryByText('Member 7')).not.toBeInTheDocument();
    });

    it('filters members when searching', async () => {
        vi.mocked(fetchTeamMembers).mockImplementation(async (_page, _limit, search) => {
        
            // If the component asks for "Manager", only return the manager
            if (search === 'Manager') {
                return { 
                    data: [mockMembers[0]], // Only Member 1 is a Manager
                    total: 1 
                };
            }

            // Otherwise, return everyone
            return { 
                data: mockMembers, 
                total: mockMembers.length 
            };
        });

        render(<Directory />, { wrapper: createWrapper() });

        await waitFor(() => expect(screen.getByText('Member 1')).toBeInTheDocument());

        const searchInput = screen.getByTestId('searchBox');

        fireEvent.change(searchInput, { target: { value: 'Manager' } });

        await waitFor(() => {
            expect(screen.getByText('Member 1')).toBeInTheDocument(); // Still there
            expect(screen.queryByText('Member 2')).not.toBeInTheDocument(); // Gone!
        });
    });

    it('paginates correctly', async () => {
        vi.mocked(fetchTeamMembers).mockImplementation(async (page, limit) => {
            // Calculate the slice indices exactly like the backend would
            const start = (page - 1) * limit;
            const end = start + limit;
            
            return {
                data: mockMembers.slice(start, end), // Return just this page's slice
                total: mockMembers.length            
            };
        });
        render(<Directory />, { wrapper: createWrapper() });

        await waitFor(() => expect(screen.getByText('Member 1')).toBeInTheDocument());
        expect(screen.queryByText('Member 7')).not.toBeInTheDocument(); 

        // 3. Click Next
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        // 4. Verify Page 2 (Member 7 appears, Member 1 disappears)
        await waitFor(() => {
            expect(screen.getByText('Member 7')).toBeInTheDocument();
        });
        expect(screen.queryByText('Member 1')).not.toBeInTheDocument(); 
    });

    it('opens and closes the modal', async () => {
        vi.mocked(fetchTeamMembers).mockResolvedValue({data: mockMembers, total: mockMembers.length});
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
