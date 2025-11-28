// Full width dropdown menu for navigation to showcase all the products and guides
import { useState } from 'react';

const NavigationDropDownMenu = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 px-2 py-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                aria-label="Select language"
            >
                <span className="text-base">{currentLanguage?.flag}</span>
            </button>
        </div>
    )
}
export default NavigationDropDownMenu;