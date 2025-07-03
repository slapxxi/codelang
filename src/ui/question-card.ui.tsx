import { MessageCircleQuestionMark } from 'lucide-react';
import type { TQuestion } from '~/types';
import { href, Link } from 'react-router';

type QuestionCardProps = {
  question: TQuestion;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const answers = question.answers;

  return (
    <article className="p-2 flex flex-col gap-1 rounded border border-olive-500/50 bg-olive-500/50 backdrop-blur-px">
      <h2 className="text-lg leading-none">
        <Link to={href('/questions/:questionId', { questionId: question.id })} className="block hover:underline">
          {question.title}
        </Link>
      </h2>
      {answers.length > 0 && (
        <footer className="flex gap-2">
          <span className="inline-flex gap-1 items-center ml-auto">
            <MessageCircleQuestionMark size={16} />
            <span>{question.answers.length}</span>
          </span>
        </footer>
      )}
    </article>
  );
};
