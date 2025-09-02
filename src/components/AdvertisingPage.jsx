import Script from "next/script";

export default function AdvertisingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Advertising</h1>
      <p className="mb-6">
        View our latest promos below and chat with our sales team for bookings.
      </p>

      {/* Promos Gallery */}
      {/* <PromosAdminGallery /> if you want to show promos here too */}

      {/* Tawk.to Chat Widget */}
      <Script
        id="tawkto"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `,
        }}
      />
    </div>
  );
}
