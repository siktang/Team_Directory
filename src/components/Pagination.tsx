interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

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

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onPageChange(Number(e.target.value));
    };

    return (
        <div>
            {currentPage === 1 ? null:
                <button 
                    onClick={handlePrevious} 
                >
                    Previous
                </button>
            }
            
            <span>
                Page 
                <select 
                    value={currentPage} 
                    onChange={handleSelectChange}
                    aria-label="Select Page" 
                >
                    {pageOptions.map((page) => (
                        <option key={page} value={page}>
                            {page}
                        </option>
                    ))}
                </select>
                of <strong>{totalPages}</strong>
            </span>
            
            {currentPage >= totalPages ? null:
                <button 
                    onClick={handleNext} 
                >
                    Next
                </button>
            }
        </div>
    );
};

export default Pagination;