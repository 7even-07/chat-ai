// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import Clients from "./clients";
import Skills from "./skills";
import Projects from "./projects";
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
      <ChatAI/>
      <Clients />
      <Skills />
      <Projects />
      <Resume />
      <Testimonial />
      <PopularClients />
      <ContactForm />
      <Footer />
    </>
  );
}
