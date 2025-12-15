import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AddMemberForm from '../../components/AddMember';
import { createTeamMember } from '../../api/teamApi';
import type { Mock } from 'vitest';

vi.mock('../../api/teamApi', () => ({
    createTeamMember: vi.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
    );
};

describe('AddMemberForm', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.clearAllMocks();
    
    });

    const renderComponent = () => 
        render(<AddMemberForm onClose={mockOnClose} />, { wrapper: createWrapper() });

    it('renders all form fields correctly', () => {
        renderComponent();

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
        expect(screen.getByTestId('add-member')).toBeInTheDocument();
    });

    it('updates input values when typing', () => {
        renderComponent();

        const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
        
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        
        expect(nameInput.value).toBe('John Doe');
    });

    it('calls the API and closes on success', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'Dev' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'alice@test.com' } });
        fireEvent.change(screen.getByLabelText(/Bio/i), { target: { value: 'React Expert' } });

        const submitBtn = screen.getByTestId('add-member');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(createTeamMember).toHaveBeenCalledWith({
                name: 'Alice',
                role: 'Dev',
                email: 'alice@test.com',
                bio: 'React Expert',
            }, 
            expect.anything());
        });

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('shows alert and does NOT close on error', async () => {
        (createTeamMember as Mock).mockRejectedValue(new Error('Server Error'));

        renderComponent();

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Bob' } });
        fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'Manager' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bob@test.com' } });
        fireEvent.change(screen.getByLabelText(/Bio/i), { target: { value: 'Boss' } });

        fireEvent.click(screen.getByTestId('add-member'));

        await waitFor(() => {
          expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Failed'));
        });

        // Ensure modal stayed OPEN
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Cancel is clicked', () => {
        renderComponent();

        const cancelBtn = screen.getByTestId('cancel');
        fireEvent.click(cancelBtn);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
});