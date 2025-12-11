interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const handlePrevious = () => {
        if (currentPage > 1) {
        onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
        }
    };

    return (
        <div>
            <button 
                onClick={handlePrevious} 
                disabled={currentPage === 1}
            >
                Previous
            </button>
            
            <span>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            
            <button 
                onClick={handleNext} 
                disabled={currentPage >= totalPages}
            >
                Next
            </button>
        </div>
    );
};