const EmptyState = ({ icon, title, message, actionLabel, onAction }) => {

  return (
    <div className="flex flex-col items-center justify-center
                    py-16 px-4 text-center">

      <div className="text-6xl mb-4">{icon}</div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-red-600 hover:bg-red-700 text-white text-sm
                     font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

