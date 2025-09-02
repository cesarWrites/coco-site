export default async function ReelLivestream() {
    const r = await fetch("https://yourwp.com/wp-json/reels/v1/settings", {
      cache: "no-store",
    });
    const data = await r.json();
  
    if (!data.youtube_url) return null;
  
    return (
      <div className="w-full aspect-video">
        <iframe
          src={data.youtube_url}
          width="100%"
          height="100%"
          title="Reels Livestream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  