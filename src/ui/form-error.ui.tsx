type FormErrorsProps = {
  error?: string;
};

export const FormError: React.FC<FormErrorsProps> = (props) => {
  const { error } = props;

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  return null;
};
