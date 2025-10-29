interface HighlightButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
}
export default function HighlightButton(props: HighlightButtonProps) {
    const {text, onClick, className = ""} = props;
    return (
        <div className={className}>
            <button className="bg-(--color-primary-button) text-(--color-primary-co ntrast) px-4 py-2 rounded-md hover:bg-(--color-primary-button-hover) transition-all duration-300" onClick={onClick}>
                {text}
            </button>
        </div>
    )
}