import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  className?: string;
  target?: "_blank" | "_self";
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  target = "_self",
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-full px-6 py-3 font-bold transition-all duration-300";

  const variants = {
    primary:
      "bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105",

    outline:
      "border-2 border-yellow-400 text-yellow-500 hover:bg-yellow-400 hover:text-black",
  };

  const classes = `${baseClass} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}