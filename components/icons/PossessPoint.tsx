import clsxm from "@/lib/clsxm";

export default function PossessPoint({ className }: { className?: string }) {
  return (
    <svg
      className={clsxm(
        "text-white text-xs bg-green-500 rounded-full mr-2 p-1",
        className
      )}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
