export default function LiveVideoStream() {
    return (
      <div className="video-wrapper">
        <h2 className="text-xl font-semibold mb-4">Live Video Broadcast</h2>
        <div className="video-container">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/live_stream?channel=UCBDOaZVCXg7p72rW6v7g71w&autoplay=1"
            title="Coco FM Live Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }
  