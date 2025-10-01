import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const team = [
  {
    name: "Kasim Mbui",
    title: "Radio Presenter & Journalist at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-11.png",
    description:
      "Kassim Mbui is a dynamic and influential media personality at Coco FM. Known for his engaging style and informative approach, Kassim brings a wealth of experience in radio broadcasting.",
  },
  {
    name: "Binti Umazi",
    title: "Radio Presenter",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/05/Untitled-design-4.png",
    description:
      "Umazi is a vibrant media personality. With her sense of humor, she has established herself as one of the standout figures in both radio broadcasting",
  },
  {
    name: "Sister Shanniez",
    title: "Radio Presenter & Media Personality at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-13.png",
    description:
      "Sister Shanniez is an influential and vibrant radio presenter. With years of experience in the radio industry, Shanniez is known for her ability to connect deeply with her audience.",
  },
  {
    name: "Pyukapyu Wa Pyukupyu (PPO)",
    title: "Radio Presenter & Media Personality at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-14.png",
    description:
      "Pyukapyu Wa Pyukupyu, popularly known as PPO, is a highly entertaining and charismatic radio presenter at Coco FM, one of the leading stations in Kenya's coastal region.",
  },
  {
    name: "Mariam Rachuo",
    title: "Radio Presenter & Media Personality at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-15.png",
    description:
      "Mariam Rachuo is a talented and captivating radio presenter known for her engaging content, especially during her time hosting late-night shows. With a unique approach to radio broadcasting, Mariam has made a name for herself.",
  },
  {
    name: "Hon. Baba Yaga",
    title: "Radio Presenter & Media Personality at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-16.png",
    description:
      "Hon. Baba Yaga is a charismatic and youthful radio presenter, known for his engaging style, thought-provoking content, and his ability to connect with a wide audience, particularly the Gen Z demographic.",
  },
  {
    name: "Ruby Kache",
    title: "Radio Presenter & Social Media Influencer at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-17.png",
    description:
      "Ruby Kache is a rising star in the radio industry, currently making her mark as a radio presenter at Coco FM. Known for her vibrant personality and immense social media influence, Ruby brings a fresh perspective to the station, particularly in appealing to Kenya's Gen Z demographic",
  },
  {
    name: "Anita Santuri",
    title: "Radio Presenter & Media Personality at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-18.png",
    description:
      "Anita Santuri is a dynamic radio presenter at Coco FM, where she has quickly become a favorite among listeners in Kenya’s coastal region. Known for her vibrant personality and relatable style, Anita has established herself as a key figure in the local media landscape.",
  },
  {
    name: "Joseph Marwa",
    title: "Radio Presenter & Media Personality at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-19.png",
    description:
      "Joseph Marwa is a talented and energetic radio presenter, currently making waves at Coco FM in Kenya’s coastal region. Known for his engaging personality and deep connection with his audience, Joseph brings a unique blend of entertainment,",
  },
  {
    name: "Dr. Kokoro",
    title: "Comedian & Radio Presenter at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-24.png",
    description:
      "Kokoro is a dynamic and hilarious comedian, renowned for his infectious humor and vibrant personality, which have made him a beloved figure in Kenya's coastal media landscape. Known for his wit, and ability to entertain, Kokoro has built a dedicated following both on the airwaves..",
  },
  {
    name: "Mama Madikodiko",
    title: "Radio Presenter at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-23.png",
    description:
      "Mama Madikodiko is a renowned radio presenter at Coco FM, where she has become a significant figure in the Kenyan radio industry. Known for her engaging and charismatic personality, Madikodiko brings a unique voice to the airwaves, focusing on the celebration and exploration of Swahili culture.",
  },
  {
    name: "Nyanya Rukia",
    title: "Comedian & Radio Presenter at Coco FM",
    photo: "https://backend.cocomedia.co.ke/wp-content/uploads/2025/03/Untitled-design-20.png",
    description:
      "Nyanya Rukia is a talented and charismatic coastal comedian, widely recognized for her infectious humor and relatable storytelling. Known for her unique style of comedy that draws from the rich cultural fabric of Kenya’s coastal region, Nyanya has become one of the standout personalities in the Kenyan comedy scene.",
  },
];


export default function AboutUs() {
  return (
    <div>
    <div className="page-wrapper">
      <div className="h-[10vh]">
      <Navbar />
      </div>
      <h1 className="about-title">Our Team</h1>

      <div className="team-grid">
        {team.map((member, i) => (
          <div key={i} className="team-card">
            <div className="photo-wrapper">
              <img src={member.photo} alt={member.name} className="team-photo" />
            </div>
            <h2 className="team-name">{member.name}</h2>
            <p className="team-title">{member.title}</p>
            <p className="team-description">{member.description}</p>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
  </div>
  );
}
