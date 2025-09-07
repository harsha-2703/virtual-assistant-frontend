const Tooltip = ({ content, children, position = 'top' }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`
            absolute z-10 hidden group-hover:flex
            whitespace-pre-line text-sm text-white bg-gray-800 px-3 py-2 rounded-md shadow-lg
            max-w-xs w-max
            ${position === 'top' && 'bottom-full left-1 mb-4'}
            ${position === 'bottom' && 'top-full right-0 mt-4'}
            ${position === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2'}
            ${position === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2'}
        `}
        >
            {content}
        </div>
    </div>
  );
};

export default Tooltip;
