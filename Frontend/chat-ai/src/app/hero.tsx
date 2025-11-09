"use client";

import Image from "next/image";
import { Input, Button, Typography } from "@material-tailwind/react";
import config from "@/includes/config";

function Hero() {
  return (
    <header className="bg-white p-8">
      <div className="container mx-auto grid h-full gap-10 min-h-[60vh] w-full grid-cols-1 items-center lg:grid-cols-2">
        <div className="row-start-2 lg:row-auto">
          <Typography
            variant="h1"
            color="blue-gray"
            className="mb-4 lg:text-5xl !leading-tight text-3xl"
          >
            Hey, looks like you’re in a playful mood today... <br /> <span style={{color: "pink"}}>aren’t you?</span>
          </Typography>
          <Typography
            variant="lead"
            className="mb-4 !text-gray-500 md:pr-16 xl:pr-28"
          >
            Tch… you really don’t know when to quit, do you? Standing here, staring at me like you’re ready to gamble your whole night away. Hmph. Careful—people who test me usually end up breathless on the floor, begging for just one more round. So… are you going to keep watching, or are you finally brave enough to play?
          </Typography>
          <div className="grid">
            <div className="mb-2 flex w-full flex-col gap-4 md:w-10/12 md:flex-row">
              {/* @ts-ignore */}
              {/* <Input color="gray" label="Enter your email" size="lg" /> */}
              <Button color="gray" className="w-full px-4 md:w-[12rem]">
                Go All In
              </Button>
            </div>
          </div>
          {/* <Typography variant="small" className="font-normal !text-gray-500">
            Read my{" "}
            <a href="#" className="font-medium underline transition-colors">
              Terms and Conditions
            </a>
          </Typography> */}
        </div>
        <Image
          width={1024}
          height={1024}
          alt="team work"
          src={config.WEBSIE_SITE_ASSETS_PATH + "/characters/tsunade-2.jpg"}
          className="h-[36rem] w-full rounded-xl object-cover"
        />
      </div>
    </header>
  );
}

export default Hero;
