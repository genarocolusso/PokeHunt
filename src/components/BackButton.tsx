import { useNavigate } from "react-router";

interface backButtonProps {
  text?: string;
  small?: boolean;
}
export const BackButton = ({ text = "Back to home", small = false }: backButtonProps) => {
  const navigate = useNavigate();
  if (small) {
    return (
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2  rounded-full transition-all duration-200 flex items-center hover:cursor-pointer hover:-translate-x-1"
        title={text}
      >
        <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {text}
      </button>
    );
  }
  return (
    <button
      onClick={() => navigate("/")}
      className="px-6 py-2 group/backbutton rounded-full border-2 border-white/20 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors duration-200 flex items-center gap-2 hover:cursor-pointer"
      title={text}
    >
      <svg
        className="group-hover/backbutton:-translate-x-1 transition-all duration-200 w-4 h-4 text-gray-700 dark:text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {text}
    </button>
  );
};
