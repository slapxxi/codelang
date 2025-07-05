export const Spinner: React.FC = () => {
  return (
    <svg viewBox="0 0 20 20" className="size-5">
      <circle
        cx="10"
        cy="10"
        r="8"
        className="stroke-2 fill-none stroke-current animate-spin origin-center"
        strokeDasharray="6"
      />
    </svg>
  );
};
