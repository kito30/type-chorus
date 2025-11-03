import HighlightButton from "../ui-kit/highlightbutton";
export default function LoginCard() {
    return (
        <div className="max-w-md bg-(--color-background) text-(--color-text) rounded-md flex flex-col gap-4 p-4 ">
            <h1 className="text-balance font-bold">Sign In To Proceed</h1>
            <div className="flex flex-col gap-3 ">
                <input type="text" placeholder="Username" className="bg-(--color-input-background) text-(--color-text) rounded-md p-2 focus:outline-none focus:ring-0" autoComplete="off" />
                <input type="password" placeholder="Password" className="bg-(--color-input-background) text-(--color-text) rounded-md p-2 focus:outline-none focus:ring-0" autoComplete="new-password" />
                <HighlightButton text="Sign In" onClick={() => {}} className="self-end" />
           </div>
        </div>
    )
}