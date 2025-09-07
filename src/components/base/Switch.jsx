function Switch({ 
  checked, 
  onChange, 
  leftLabel,    // optional
  rightLabel,   // optional
  id 
}) {
  return (
    <div className="flex items-center space-x-2">
      {/* Left label, if provided */}
      {leftLabel && (
        <label 
          htmlFor={id} 
          className="cursor-pointer select-none text-gray-700"
        >
          {leftLabel}
        </label>
      )}

      {/* The switch wrapped in label for accessibility */}
      <label
        htmlFor={id}
        className="cursor-pointer relative"
      >
        {/* Hidden checkbox */}
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />

        {/* Track */}
        <div
          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
            checked ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          {/* Knob */}
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
      </label>

      {/* Right label, if provided */}
      {rightLabel && (
        <label 
          htmlFor={id} 
          className="cursor-pointer select-none text-gray-700"
        >
          {rightLabel}
        </label>
      )}
    </div>
  );
}

export default Switch;
