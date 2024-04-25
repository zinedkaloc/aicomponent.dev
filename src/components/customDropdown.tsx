import Image from "next/image";
import { useState } from "react";

type TechIcon = {
  name: string;
  url: string;
};

type Stack = {
  tech: TechIcon[];
  eta: string;
};

type CustomDropdownProps = {
  stacks: Stack[];
  onSelect: (stack: Stack) => void;
};

interface CustomDropdown {
  stacks: Stack[];
  onSelect: (stack: Stack) => void;
}

export const CustomDropdown = ({ stacks, onSelect }: CustomDropdown) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (stack: Stack) => {
    setIsLoading(true);
    onSelect(stack);
    setTimeout(() => {
      setIsLoading(false);
    }, parseDuration(stack.eta));
  };

  const parseDuration = (duration: string) => {
    const [value, unit] = duration.split(" ");
    return parseInt(value!) * (unit === "min" ? 60000 : 1000);
  };

  return (
    <div className="relative right-16 mt-8 w-48 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      <div
        className="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        {stacks.map((stack, index) => (
          <a
            href="#"
            key={index}
            className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
            onClick={() => handleSelect(stack)}
          >
            {stack.tech.map((tech, idx, arr) => (
              <span key={idx}>
                <Image
                  src={tech.url}
                  alt={tech.name}
                  width={16}
                  height={16}
                  className="mr-1 inline-block h-4 w-4"
                />
                {idx < arr.length - 1 && <span className="mx-1">+</span>}
              </span>
            ))}
            / {stack.eta}
          </a>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center py-2"></div>
        )}
      </div>
    </div>
  );
};
