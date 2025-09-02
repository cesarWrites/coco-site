export default async function ReelAdminGallery() {
    const res = await fetch("https://yourwp.com/wp-json/reels/v1/list", {
      cache: "no-store",
    });
    const files = await res.json();
  
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {files.map((f, i) => (
          <div key={i} className="border rounded p-3">
            <video src={f.url} controls className="w-full rounded" />
            <div className="mt-2 text-right">
              <a
                href={f.url}
                download
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }
  