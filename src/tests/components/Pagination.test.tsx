import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from '../../components/Pagination';

describe('Pagination Component', () => {
  // Setup a spy function for all tests
  const mockPageChange = vi.fn();

  it('does NOT render if totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={mockPageChange} />
    );
    // Expect the DOM to be empty
    expect(container).toBeEmptyDOMElement();
  });

  it('renders correctly with multiple pages', () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={mockPageChange} />
    );

    expect(screen.getByText(/Page/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Current Page
    expect(screen.getByText('5')).toBeInTheDocument(); // Total Pages
  });

  it('disables "Previous" button on the first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockPageChange} />
    );

    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    const nextBtn = screen.getByRole('button', { name: /Next/i });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();
  });

  it('disables "Next" button on the last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={mockPageChange} />
    );

    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    const nextBtn = screen.getByRole('button', { name: /Next/i });

    expect(prevBtn).toBeEnabled();
    expect(nextBtn).toBeDisabled();
  });

  it('calls onPageChange with the correct value when buttons are clicked', () => {
    // Start on Page 2
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={mockPageChange} />
    );

    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    const nextBtn = screen.getByRole('button', { name: /Next/i });

    // 1. Click Previous -> Should go to Page 1
    fireEvent.click(prevBtn);
    expect(mockPageChange).toHaveBeenCalledWith(1);

    // 2. Click Next -> Should go to Page 3
    fireEvent.click(nextBtn);
    expect(mockPageChange).toHaveBeenCalledWith(3);
  });
});