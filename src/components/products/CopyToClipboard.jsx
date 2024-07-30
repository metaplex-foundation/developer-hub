const { ClipboardIcon } = require('@heroicons/react/24/outline')

const CopyToClipboardButton = ({ text }) => {
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(text.trimEnd())
  }

  return (
    <ClipboardIcon
      className="absolute right-2 top-2 z-0 h-6 w-6 cursor-pointer text-gray-400 transition-transform hover:text-gray-600 active:scale-75 dark:text-gray-500 dark:hover:text-gray-400"
      onClick={() => copyCodeToClipboard()}
    />
  )
}

export default CopyToClipboardButton
