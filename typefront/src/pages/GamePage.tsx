export default function GamePage() {
  return (
    <div className="flex flex-col items-center pt-[20%] h-screen bg-(--color-home-bg) text-(--color-text)">
        <div className="aspect-video w-full max-w-2xl">
            <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/e1pZIfretEs"
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>  
    </div>
  );
}