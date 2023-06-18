export const getPageInfo = (limit: any, totalCount: any, currentPage: any) => {
  return {
    page: currentPage,
    limit: parseInt(limit),
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage * limit < totalCount,
    totalPages: Math.ceil(totalCount / limit),
    itemCount: totalCount,
  };
};
