import { Card, Title, Badge } from '~/ui';

type CommentsSectionProps<T extends { id: string }> = {
  title: string;
  data: T[];
  children: (item: T) => React.ReactNode;
} & Omit<React.ComponentProps<'section'>, 'children'>;

export const CommentsSection = <T extends { id: string }>(props: CommentsSectionProps<T>) => {
  const { children, title, data, className } = props;

  return (
    <section className={className}>
      <header className="mb-4 flex items-center gap-2">
        <Title level={4}>{title}</Title>
        <Badge>{data.length}</Badge>
      </header>

      <ul className="flex flex-col gap-4 pl-2">
        {data.map((item) => (
          <Card asChild key={item.id} variant="secondary">
            <li className="max-w-prose self-start p-2 break-words">{children(item)}</li>
          </Card>
        ))}
      </ul>
    </section>
  );
};
