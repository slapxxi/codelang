import { Form } from 'react-router';
import {
  Pagination as PaginationBase,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationButton,
} from './base';
import { clamp } from '~/utils';

type Props = {
  numberOfPages: number;
  currentPage: number;
  maxDisplayed?: number;
  onPageChange?: (page: number) => void;
} & React.ComponentProps<typeof PaginationBase>;

export const Pagination: React.FC<Props> = (props) => {
  const { numberOfPages, currentPage, maxDisplayed = 1, ...rest } = props;

  if (numberOfPages <= 1) {
    return null;
  }

  const cPage = clamp(currentPage, 1, numberOfPages);
  const startPage = clamp(cPage - Math.floor(maxDisplayed / 2), 1, numberOfPages);
  const endPage = clamp(cPage + Math.floor(maxDisplayed / 2), 1, numberOfPages);
  const prevPages = new Array(cPage - startPage)
    .fill(null)
    .reverse()
    .map((_, i) => cPage - (i + 1))
    .reverse();
  const nextPages = new Array(endPage - cPage).fill(null).map((_, i) => cPage + (i + 1));

  return (
    <Form method="get">
      <PaginationBase {...rest}>
        <PaginationContent>
          {prevPages.length > 0 && !prevPages.includes(1) && (
            <>
              <PaginationItem>
                <PaginationButton name="page" value={startPage}>
                  {startPage}
                </PaginationButton>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {prevPages.map((page) => (
            <PaginationItem key={page}>
              <PaginationButton name="page" value={page}>
                {page}
              </PaginationButton>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationButton name="page" value={cPage} isActive>
              {cPage}
            </PaginationButton>
          </PaginationItem>

          {nextPages.map((page) => (
            <PaginationItem key={page}>
              <PaginationButton name="page" value={page}>
                {page}
              </PaginationButton>
            </PaginationItem>
          ))}

          {nextPages.length > 0 && !nextPages.includes(numberOfPages) && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationButton name="page" value={numberOfPages}>
                  {numberOfPages}
                </PaginationButton>
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </PaginationBase>
    </Form>
  );
};
