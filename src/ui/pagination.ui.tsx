import {
  Pagination as PaginationBase,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from './base';

type Props = {
  numberOfPages: number;
  currentPage: number;
  maxDisplayed?: number;
  onPageChange?: (page: number) => void;
} & React.ComponentProps<typeof PaginationBase>;

export const Pagination: React.FC<Props> = (props) => {
  const { numberOfPages, currentPage, maxDisplayed = 1, ...rest } = props;
  const mappedPages = mapPages(numberOfPages, currentPage, maxDisplayed);

  return (
    <PaginationBase {...rest}>
      <PaginationContent>
        {mappedPages.pages.map((p, i) => (
          <PaginationItem key={i}>
            <PaginationLink to={`?page=${p}`} isActive={p === currentPage}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </PaginationBase>
  );
};

type MappedPages = {
  status: 'full' | 'start' | 'end' | 'middle';
  pages: number[];
};

function mapPages(totalPages: number, currentPage: number, maxDisplayed: number): MappedPages {
  const result: MappedPages = { status: 'middle', pages: [] };

  if (totalPages <= maxDisplayed) {
    result.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    result.status = 'full';
    return result;
  }

  const midPoint = Math.ceil(maxDisplayed / 2);
  const start = 1;

  if (currentPage <= midPoint) {
    result.pages = Array.from({ length: maxDisplayed }, (_, i) => start + i);
    result.status = 'start';
    return result;
  }

  if (currentPage >= totalPages - midPoint) {
    result.pages = Array.from({ length: maxDisplayed }, (_, i) => totalPages - maxDisplayed + i + 1);
    result.status = 'end';
    return result;
  }

  result.pages = Array.from({ length: maxDisplayed }, (_, i) => currentPage - maxDisplayed / 2 + i + 1);

  return result;
}
