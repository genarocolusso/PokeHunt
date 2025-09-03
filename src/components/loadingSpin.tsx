interface LoadingspinProps {
  color?: string;
}

export const LoadingSpin = ({ color = "emerald" }: LoadingspinProps) => {
  console.log(color);
  return <div className={`rounded-full w-6 h-6 border-b-2 border-${color}-400 animate-spin`}></div>;
};
