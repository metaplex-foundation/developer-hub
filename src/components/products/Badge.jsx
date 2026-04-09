const Badge = ({ type, className = '' }) => {

    const colorMap = {
        'new':     'bg-green-500/15 text-green-400 ring-1 ring-inset ring-green-500/30',
        'updated': 'bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/30',
        'get':     'bg-green-500/15 text-green-400 ring-1 ring-inset ring-green-500/30',
        'post':    'bg-blue-500/15 text-blue-400 ring-1 ring-inset ring-blue-500/30',
        'chain':   'bg-purple-500/15 text-purple-400 ring-1 ring-inset ring-purple-500/30',
    };

    const upperTypes = new Set(['get', 'post', 'chain']);

    return (
        <span className={`inline-flex items-center px-1.5 pt-[3px] pb-[2px] text-[0.65rem] font-semibold leading-none ${colorMap[type]} ${className}`}>
            {upperTypes.has(type) ? type.toUpperCase() : type}
        </span>
    )
};

export default Badge;