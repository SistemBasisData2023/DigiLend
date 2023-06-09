import { useState } from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  let [num, setNum] = useState(1);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePageClick = (page) => {
    onPageChange(page);
    setNum(page);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      setNum(currentPage + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      setNum(currentPage - 1);
    }
  };

  return (
    <div className="flex bg-neutral rounded-lg font-Monserrat">
      <button onClick={handlePrevClick} className="h-12 border-2 border-r-0 border-[#40476c] px-4 rounded-l-lg hover:bg-indigo-600 hover:text-white">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
        </svg>
      </button>
      {pages.map((pg) => (
        <button key={pg} onClick={() => handlePageClick(pg)} className={`h-12 border-2 border-r-0 border-[#40476c] w-12 ${currentPage === pg ? "bg-indigo-600 text-white" : ""}`}>
          {pg}
        </button>
      ))}
      <button onClick={handleNextClick} className="h-12 border-2 border-[#40476c] px-4 rounded-r-lg hover:bg-indigo-600 hover:text-white">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
