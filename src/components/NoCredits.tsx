export default function NoCredits() {
  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        <polygon points="50,15 85,85 15,85" fill="#FF6B6B" />
        <text
          x="50"
          y="75"
          fontSize="40"
          fontWeight="bold"
          textAnchor="middle"
          fill="#FFFFFF"
        >
          !
        </text>
      </svg>
      <h1 className="mb-2 text-3xl text-gray-800">No Credits</h1>
      <p className="mb-6 text-gray-600">
        You do not have enough credits to proceed with this request today.
        Please try again tomorrow.
      </p>
    </div>
  );
}
