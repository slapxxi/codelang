type FormErrorsProps = {
  error?: string;
  children?: React.ReactNode;
};

export const FormError: React.FC<FormErrorsProps> = (props) => {
  const { error, children } = props;

  if (error || children) {
    return (
      <div className="text-destructive">
        {error && <span>{error}</span>}
        {children}
      </div>
    );
  }

  return null;
};
