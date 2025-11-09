import { Typography, Button } from "@material-tailwind/react";
import config from "@/includes/config";
import Link from "next/link";

const LINKS = [
  {name:"Home", href: "/" },
  {name: "About Us", href: "javascript:void(0)"},
  {name: "Blog", href: "javascript:void(0)"},
];
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-10 px-8 pt-20">
      <div className="container mx-auto">
        <div className="mt-16 flex flex-wrap items-center justify-center gap-y-4 border-t border-gray-200 py-6 md:justify-between">
          <Typography className="text-center font-normal !text-gray-700">
            &copy; {CURRENT_YEAR} {" "}
            <Link href={config.SITE_URL}>
              {config.APP.NAME}
            </Link>{" "}
            .
          </Typography>
          <ul className="flex gap-8 items-center">
            {LINKS.map(({name, href}) => (
              <li key={name}>
                <Typography
                  as={Link}
                  href={href}
                  variant="small"
                  className="font-normal text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {name}
                </Typography>
              </li>
            ))}
            {/* <Button color="gray">subscribe</Button> */}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
