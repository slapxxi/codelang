import { useSearchParams } from 'react-router';
import {
  Pagination as PaginationBase,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from './base';
import { clamp, replaceSearchParamsValue } from '~/utils';

type Props = {
  numberOfPages: number;
  currentPage: number;
  maxDisplayed?: number;
  onPageChange?: (page: number) => void;
} & React.ComponentProps<typeof PaginationBase>;

export const Pagination: React.FC<Props> = (props) => {
  const { numberOfPages, currentPage, maxDisplayed = 1, ...rest } = props;
  const [searchParams] = useSearchParams();
  const startPage = clamp(currentPage - Math.floor(maxDisplayed / 2), 1, numberOfPages);
  const endPage = clamp(currentPage + Math.floor(maxDisplayed / 2), 1, numberOfPages);
  const prevPages = new Array(currentPage - startPage)
    .fill(null)
    .reverse()
    .map((_, i) => currentPage - (i + 1))
    .reverse();
  const nextPages = new Array(endPage - currentPage).fill(null).map((_, i) => currentPage + (i + 1));

  return (
    <PaginationBase {...rest}>
      <PaginationContent>
        {prevPages.length > 0 && !prevPages.includes(1) && (
          <>
            <PaginationItem>
              <PaginationLink to={{ search: replaceSearchParamsValue(searchParams, 'page', 1) }}>
                {startPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {prevPages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink to={{ search: replaceSearchParamsValue(searchParams, 'page', page) }}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink to={{ search: replaceSearchParamsValue(searchParams, 'page', currentPage) }} isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {nextPages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink to={{ search: replaceSearchParamsValue(searchParams, 'page', page) }}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {nextPages.length > 0 && !nextPages.includes(numberOfPages) && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink to={{ search: replaceSearchParamsValue(searchParams, 'page', numberOfPages) }}>
                {numberOfPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </PaginationBase>
  );
};
