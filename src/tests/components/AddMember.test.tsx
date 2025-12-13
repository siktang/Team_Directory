import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AddMemberForm from '../../components/AddMember';

// 1. Mock the API module
import { createTeamMember } from '../../api/teamApi';
import type { Mock } from 'vitest';

vi.mock('../../api/teamApi', () => ({
  createTeamMember: vi.fn(),
}));

// 2. Setup Wrapper (Required for useMutation)
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

  // Mock window.alert since the component uses it
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<AddMemberForm onClose={mockOnClose} />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Member/i })).toBeInTheDocument();
  });

  it('updates input values when typing', () => {
    render(<AddMemberForm onClose={mockOnClose} />, { wrapper: createWrapper() });

    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(nameInput.value).toBe('John Doe');
  });

  it('calls the API and closes on success', async () => {
    (createTeamMember as Mock).mockResolvedValue({ id: 123, name: 'New Guy' });

    render(<AddMemberForm onClose={mockOnClose} />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByLabelText(/Bio/i), { target: { value: 'React Expert' } });

    const submitBtn = screen.getByRole('button', { name: /Add Member/i });
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
    // 1. Setup Failed API mock
    (createTeamMember as Mock).mockRejectedValue(new Error('Server Error'));

    render(<AddMemberForm onClose={mockOnClose} />, { wrapper: createWrapper() });

    // 2. Fill out required fields (to allow submission)
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'Manager' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bob@test.com' } });
    fireEvent.change(screen.getByLabelText(/Bio/i), { target: { value: 'Boss' } });

    // 3. Submit
    fireEvent.click(screen.getByRole('button', { name: /Add Member/i }));

    // 4. Wait for the error handling
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Failed'));
    });

    // 5. Ensure modal stayed OPEN
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<AddMemberForm onClose={mockOnClose} />, { wrapper: createWrapper() });

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});