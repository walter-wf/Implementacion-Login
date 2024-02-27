function previousPage() {
    if (currentPage > 1) {
      window.location.href = `/api/products?page=${currentPage - 1}`;
    }
  }
  
  function nextPage() {
    if (currentPage < totalPages) {
      window.location.href = `/api/products?page=${currentPage + 1}`;
    }
  }