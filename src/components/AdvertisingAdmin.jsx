export default async function PromosAdminGallery() {
    const res = await fetch("https://cocomedia.co.ke/wp-json/promos/v1/list", {
      cache: "no-store",
    });
    const promos = await res.json();
  
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {promos.map((p, i) => (
          <div key={i} className="border rounded p-3">
            {p.url.endsWith(".mp4") ? (
              <video src={p.url} controls className="w-full rounded" />
            ) : (
              <img src={p.url} alt={p.name} className="w-full rounded" />
            )}
            <div className="mt-2 text-sm flex justify-between">
              <span>{p.name}</span>
              <a href={p.url} download className="text-blue-600">Download</a>
            </div>
          </div>
        ))}
      </div>
    );
  }
  