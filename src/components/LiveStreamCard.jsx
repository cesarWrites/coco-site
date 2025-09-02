export default function LiveStreamCard() {
    return (
      <div className="live-stream-card">
        <div className="stream-info">
          <p className="stream-title">🎙️ Coco Fm 98.9FM Live</p>
          <audio controls className="audio-player">
            <source src="https://stream.zeno.fm/ki2jypviprwuv" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    );
  }
  