const Badge = ({ type, className = '' }) => {

    const colorMap = {
        'new': 'bg-green-100 text-green-800',
        'updated': 'bg-yellow-100 text-yellow-800',
        'get': 'bg-green-100 text-green-800',
        'post': 'bg-blue-100 text-blue-800',
        'chain': 'bg-purple-100 text-purple-800',
    };

    const upperTypes = new Set(['get', 'post', 'chain']);

    return (
        <span className={`inline-block px-1.5 py-0.5 text-[0.65rem] font-semibold leading-none rounded-full ${colorMap[type]} ring-1 ring-neutral-300 ${className}`}>
            {upperTypes.has(type) ? type.toUpperCase() : type}
        </span>
    )
};

export default Badge;