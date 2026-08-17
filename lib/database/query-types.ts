export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function normalizePagination(
  pageParam?: string | null,
  pageSizeParam?: string | null
): PaginationInput {
  const page = Math.max(
    1,
    Number.parseInt(pageParam ?? "1", 10) || 1
  );

  const requestedPageSize =
    Number.parseInt(pageSizeParam ?? "25", 10) || 25;

  const pageSize = Math.min(
    Math.max(requestedPageSize, 1),
    100
  );

  return {
    page,
    pageSize,
  };
}