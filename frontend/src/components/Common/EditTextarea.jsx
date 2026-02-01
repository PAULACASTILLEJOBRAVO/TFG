import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const EditTextarea = ({ label, value, ...props }) => {
  return (
    <div className="relative w-full">
      <Textarea
        id={props.id}
        {...props}
        value={value}
        placeholder=" "
        className="
          peer
          min-h-[6rem]
          w-full
          px-3 pt-6
          bg-transparent
          text-black
          border-0
          border-b-2
          border-gray-300
          rounded-none
          resize-none
          placeholder-transparent
          focus:outline-none
          focus:ring-0
          focus-visible:ring-0
          focus-visible:ring-offset-0
          focus-visible:border-black
        "
      />

      <Label
        htmlFor={props.id}
        className={`
          absolute
          left-3 top-[0.9rem]
          z-10
          origin-left
          text-gray-500 text-xs
          transition-all
          duration-200
          peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-muted-foreground
          ${
            value
              ? "top-1 translate-y-0 text-xs text-muted-foreground"
              : "peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
          }
        `}
      >
        {label}
      </Label>
    </div>
  );
};

export default EditTextarea;
