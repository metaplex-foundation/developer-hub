const Badge = ({ type }) => {

    const colorMap = {
        'new': 'bg-green-100 text-green-800',
        'updated': 'bg-yellow-100 text-yellow-800',
    };

    return (
        <span className={`inline-block ml-2 px-2 py-1 text-xs font-semibold leading-none rounded-full ${colorMap[type]}`}>
            {type}
        </span>
    )
};

export default Badge;