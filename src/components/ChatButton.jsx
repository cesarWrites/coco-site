import { FaWhatsapp } from 'react-icons/fa';

export default function ChatButton() {
  const whatsappNumber = "254723807802"; 
  const prefilledMsg = "Hello, I am interested in advertising with Coco Media";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledMsg)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-chat-btn"
    >
      <FaWhatsapp className="mr-2" />
      Chat with Sales Agent
    </a>
    
    
  );
}
