type CodeProps = {
  code?: string;
};

export const Code: React.FC<CodeProps> = (props) => {
  const { code } = props;

  if (!code) {
    return null;
  }

  return <pre dangerouslySetInnerHTML={{ __html: code }} className="*:p-2 *:rounded *:shadow" />;
};
