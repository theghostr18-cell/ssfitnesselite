import g1 from "@/assets/gallery/gym_1.jpg.asset.json";
import g2 from "@/assets/gallery/gym_2.jpg.asset.json";
import g3 from "@/assets/gallery/gym_3.jpg.asset.json";
import g4 from "@/assets/gallery/gym_4.jpg.asset.json";
import g5 from "@/assets/gallery/gym_5.jpg.asset.json";
import g6 from "@/assets/gallery/gym_6.jpg.asset.json";
import g7 from "@/assets/gallery/gym_7.jpg.asset.json";
import g8 from "@/assets/gallery/gym_8.jpg.asset.json";
import g9 from "@/assets/gallery/gym_9.jpg.asset.json";

export const BIZ = {
  name: "SS Fitness Elite",
  short: "SS ELITE",
  category: "Gym in Badlapur, Maharashtra",
  rating: 5.0,
  reviewCount: 79,
  phoneDisplay: "+91 83081 41817",
  phoneTel: "+918308141817",
  whatsapp: "918308141817",
  instagram: "https://www.instagram.com/ssfitnesselitebadlapur/",
  instagramHandle: "@ssfitnesselitebadlapur",
  address:
    "2nd floor, Ganaraya building, New DP Rd, near Ghorpade Chowk, Aptewadi, Katrap, Badlapur East, Maharashtra 421503",
  addressShort: "2nd Floor, Ganaraya Building · Katrap, Badlapur East",
  hours: "Open today · closes 11 pm",
  mapsQuery: "Ss Fitness Elite, Ganaraya building, New DP Rd, Katrap, Badlapur 421503",
  about:
    "SS Fitness Elite is a premium fitness gym located in Badlapur East, near Ghorpade Chowk on New DP Road, Katrap. We offer a complete fitness experience with modern equipment, expert trainers, and a motivating environment.",
  reviewSummary:
    "People say this gym features a wide variety of modern equipment and is consistently clean and well-maintained. They also highlight the motivating and positive atmosphere, making it an enjoyable place to work out. Guests mention the trainers are professional, supportive, and provide excellent guidance for achieving fitness goals.",
  reviews: [
    { name: "Shilpa Watode", text: "Friendly trainers, clean environment, good equipment, and a positive atmosphere." },
    { name: "Sahil Gangurde", text: "Good experience well trainer supportive staff" },
    { name: "Swappy", text: "Nice place to workout with" },
  ],
  offer: { title: "1 Year Membership", price: "₹5,999", note: "As posted on our Instagram — call to confirm current pricing." },
};

export const SERVICES = [
  { id: "crossfit", n: "01", title: "CrossFit", text: "Challenge yourself with CrossFit. Contact the gym for session details.", obj: "plate" as const },
  { id: "zumba", n: "02", title: "Zumba", text: "Bring your energy to Zumba. Contact the gym for session details.", obj: "dumbbell" as const },
  { id: "yoga", n: "03", title: "Yoga", text: "Make space for Yoga in your routine. Contact the gym for session details.", obj: "kettlebell" as const },
  { id: "gym", n: "04", title: "Gym", text: "Train on the gym floor with modern equipment and a motivating environment.", obj: "plate" as const },
  { id: "cardio", n: "05", title: "Cardio", text: "Keep moving in the cardio zone with treadmills, ellipticals and spin bikes.", obj: "dumbbell" as const },
];

export const PHOTOS = [g5, g1, g2, g3, g4, g6, g7, g8, g9].map((a, i) => ({ src: a.url, alt: `Inside SS Fitness Elite — photo ${i + 1}` }));

export const waLink = (msg: string) => `https://wa.me/${BIZ.whatsapp}?text=${encodeURIComponent(msg)}`;
