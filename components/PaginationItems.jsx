import {
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
  } from "./ui/pagination";
  
  const PaginationItems = ({ currentPage, totalPages, handlePageChange }) => {
    const items = [];
  
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={1 === currentPage}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      items.push(<PaginationEllipsis key="start-ellipsis" />);
    }
  
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === currentPage}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    if (currentPage < totalPages - 2) {
      items.push(<PaginationEllipsis key="end-ellipsis" />);
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={totalPages === currentPage}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    return items;
  };
  
  export default PaginationItems;
  