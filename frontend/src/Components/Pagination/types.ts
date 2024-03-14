export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
}
