"use client";

import { ProjectCard } from "@/components";
import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import { getCharacters } from "@/services/charactersAPI";
import { useEffect, useState } from "react";
import { Character } from "@/types/characters";


// const PROJECTS = [
//   {
//     img: "/image/blog-1.svg",
//     title: "Mobile App Development",
//     desc: "Mobile app designed to help users discover and explore local restaurants and cuisines.",
//   },
//   {
//     img: "/image/blog2.svg",
//     title: "Landing Page Development",
//     desc: "Promotional landing page for a  fitness website Summer Campaign. Form development included.",
//   },
//   {
//     img: "/image/blog3.svg",
//     title: "Mobile App Development",
//     desc: "Mobile app designed to help users discover and explore local restaurants and cuisines.",
//   },
//   {
//     img: "/image/blog4.svg",
//     title: "E-commerce development",
//     desc: "Ecommerce website offering  access to the latest and greatest gadgets and accessories.",
//   },
//   {
//     img: "/image/blog-1.svg",
//     title: "Mobile App Development",
//     desc: "Mobile app designed to help users discover and explore local restaurants and cuisines.",
//   },
//   {
//     img: "/image/blog2.svg",
//     title: "Landing Page Development",
//     desc: "Promotional landing page for a  fitness website Summer Campaign. Form development included.",
//   },
//   {
//     img: "/image/blog3.svg",
//     title: "Mobile App Development",
//     desc: "Mobile app designed to help users discover and explore local restaurants and cuisines.",
//   },
//   {
//     img: "/image/blog4.svg",
//     title: "E-commerce development",
//     desc: "Ecommerce website offering  access to the latest and greatest gadgets and accessories.",
//   },
// ];

export function Projects() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const fetchCharacters = async () => {
    const data = await getCharacters();
    setCharacters(data);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);
  console.log(characters);

  return (
    <section className="py-28 px-8">
      <div className="container mx-auto mb-20 text-center">
        <Typography variant="h2" color="blue-gray" className="mb-4">
          Characters
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full px-4 font-normal !text-gray-500 lg:w-6/12"
        >
          Dive Into The Fantacies....
        </Typography>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-4">
        {characters.map((char, index) => (
          <ProjectCard key={index} {...char} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
