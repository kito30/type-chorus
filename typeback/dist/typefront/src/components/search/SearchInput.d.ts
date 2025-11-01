export default function SearchInput({ value, onChange, onSearch, }: {
    value: string;
    onChange: (v: string) => void;
    onSearch?: () => void;
}): import("react").JSX.Element;
