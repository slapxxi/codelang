type FormSuccessProps = {
  children?: React.ReactNode;
};

export const FormSuccess: React.FC<FormSuccessProps> = (props) => {
  const { children } = props;

  if (children) {
    return <div className="text-success">{children}</div>;
  }

  return null;
};
