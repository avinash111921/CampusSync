const StatCard = ({ icon: Icon, title, value, borderColor, iconColor }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${borderColor}`}>
      <div className="flex items-center">
        <Icon className={`w-8 h-8 ${iconColor} mr-3`} />
        <div>
          <p className="text-sm text-gray-600" aria-label={title}>{title}</p>
          <p className="text-2xl font-bold">
            {value !== undefined && value !== null ? (
              typeof value === 'number' ? value.toFixed(2) : value
            ) : (
              <span className="text-gray-400 animate-pulse">...</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;