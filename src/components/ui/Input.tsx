import {
  FocusEventHandler,
  HTMLInputTypeAttribute,
  LegacyRef,
  MouseEventHandler,
  ReactNode,
  useRef,
} from "react";

type Props = {
  type?: HTMLInputTypeAttribute;
  title: string;
  onClick: MouseEventHandler<HTMLInputElement>;
  placeholder?: string;
  icon: ReactNode;
};

const Input = ({ type = "text", title, onClick, placeholder, icon }: Props) => {
  return (
    <div className="flex flex-row items-center gap-x-2 rounded-md border border-font-secondary p-2 focus-within:border-font-tertiary">
      <span className="text-xl text-font-tertiary">{icon}</span>
      <input
        type={type}
        title={title}
        onClick={onClick}
        placeholder={placeholder}
        className="h-full w-full bg-transparent font-heading outline-none"
      />
    </div>
  );
};

export default Input;
