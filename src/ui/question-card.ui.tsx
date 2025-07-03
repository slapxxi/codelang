import { MessageCircleQuestionMark } from 'lucide-react';
import type { TQuestion } from '~/types';
import { href, Link } from 'react-router';
import { Card, CardFooter, CardHeader } from '~/ui';

type QuestionCardProps = {
  question: TQuestion;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const answers = question.answers;

  return (
    <Card asChild variant="interactive">
      <Link to={href('/questions/:questionId', { questionId: question.id })}>
        <CardHeader>
          <h2 className="text-lg leading-none">{question.title}</h2>
        </CardHeader>
        <CardFooter>
          {answers.length > 0 && (
            <footer className="flex gap-2">
              <span className="inline-flex gap-1 items-center ml-auto">
                <MessageCircleQuestionMark size={16} />
                <span>{question.answers.length}</span>
              </span>
            </footer>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};
