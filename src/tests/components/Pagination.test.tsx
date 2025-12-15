import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '../../components/Pagination';

describe('Pagination Component', () => {
    const mockPageChange = vi.fn();

    const renderComponent = ( props = {} ) => {
        const mergedProps = {
            currentPage: 1, 
            totalPages: 5, 
            onPageChange: mockPageChange,
            ...props
        }

        return render(
          <Pagination {...mergedProps} />
        )
    };

    it('does NOT render if totalPages is 1 or less', () => {
        const { container } = renderComponent({totalPages: 1});
     
        expect(container).toBeEmptyDOMElement();
    });

    it('renders correctly with multiple pages', () => {
        renderComponent({currentPage: 2});

        const dropdown = screen.getByLabelText('Select Page'); 

        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveValue('2');
    });

    it('does not show "Previous" button on the first page', () => {
        renderComponent();

        const prevBtn = screen.queryByText(/Previous/i)
        const nextBtn = screen.getByRole('button', { name: /Next/i });

        expect(prevBtn).not.toBeInTheDocument();
        expect(nextBtn).toBeEnabled();
    });

    it('does not show "Next" button on the last page', () => {
        renderComponent({currentPage: 5});

        const prevBtn = screen.getByRole('button', { name: /Previous/i });
        const nextBtn = screen.queryByText(/Next/i)

        expect(prevBtn).toBeEnabled();
        expect(nextBtn).not.toBeInTheDocument();
    });

    it('calls onPageChange with the correct value when buttons are clicked', () => {
        renderComponent({currentPage: 2});

        const prevBtn = screen.getByRole('button', { name: /Previous/i });
        const nextBtn = screen.getByRole('button', { name: /Next/i });

        fireEvent.click(prevBtn);
        expect(mockPageChange).toHaveBeenCalledWith(1);

        fireEvent.click(nextBtn);
        expect(mockPageChange).toHaveBeenCalledWith(3);
    });
});