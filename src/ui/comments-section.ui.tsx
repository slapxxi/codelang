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
      <header className="flex gap-2 items-center mb-4">
        <Title level={4}>{title}</Title>
        <Badge>{data.length}</Badge>
      </header>

      <ul className="flex flex-col gap-4 pl-2">
        {data.map((item) => (
          <Card asChild key={item.id} variant="secondary">
            <li className="p-2 max-w-prose break-words self-start">{children(item)}</li>
          </Card>
        ))}
      </ul>
    </section>
  );
};
