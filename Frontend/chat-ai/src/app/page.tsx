// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import Clients from "./clients";
import Skills from "./skills";
import Characters from "./characters";
import Resume from "./resume";
import Testimonial from "./testimonial";
import PopularClients from "./popular-clients";
import ContactForm from "./contact-form";
import ChatAI from "@/components/chat-ai";

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* <ChatAI/> */}
      <Characters />
      {/* <Clients />
      <Skills />
      <Resume />
      <Testimonial />
      <PopularClients />
      <ContactForm /> */}
      <Footer />
    </>
  );
}
