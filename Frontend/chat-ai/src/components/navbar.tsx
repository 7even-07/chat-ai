import React, { useState } from "react";
import config from "../includes/config";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  CommandLineIcon,
  Squares2X2Icon,
  XMarkIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { openLoadingModal, closeLoadingModal, showResponseMessage } from "@/app/lib/alert";
import { logoutAPI } from "@/services/authenticationAPI";
import { useAuth } from "./AuthContext";




interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Typography
        as="a"
        href={href || "#"}
        target={href ? "_blank" : "_self"}
        variant="paragraph"
        color="gray"
        className="flex items-center gap-2 font-medium text-gray-900"
      >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState("Guest");
  const router = useRouter();
  const handleOpen = () => setOpen((cur) => !cur);

const handleLogout = async () => {
    try {
      openLoadingModal();
      const result = await logoutAPI();

      await showResponseMessage(result.response_code, result.response_message);

      if (result.response_code === true) {
        setIsLoggedIn(false);
        router.push("/auth/login");
      }
    } catch (err) {
      await showResponseMessage(false, "Something went wrong while logging out");
    } finally {
      closeLoadingModal();
    }
  };

  React.useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${config.BACKENDSITEURL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();        
        setUserId(data.response_data.id);
        setUsername(data.response_data.username);
        setIsLoggedIn(data.response_code === true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const NAV_MENU = [
    ...(isLoggedIn
      ? [
          {
            name: "Account",
            icon: UserCircleIcon,
            href: `user-account/${userId}/${username}`,
          },
      ]
      : []
    ),
  ];



  return (
    <MTNavbar shadow={false} fullWidth className="border-0 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Typography color="blue-gray" className="text-lg font-bold">
          <a href={config.SITE_URL}>{config.APP.NAME}</a>
        </Typography>
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem key={name} href={href}>
              <Icon className="h-5 w-5" />
              {name}
            </NavItem>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          {!isLoggedIn ? (
            <>
              <a href={`${config.SITE_URL}/auth/register`}>
                <Button variant="text">Sign Up</Button>
              </a>
              <a href={`${config.SITE_URL}/auth/login`}>
                <Button color="gray">Login</Button>
              </a>
            </>
          ) : (
            <Button color="red" onClick={handleLogout}>
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
              Logout
            </Button>
          )}
        </div>

        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map(({ name, icon: Icon }) => (
              <NavItem key={name}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
          <div className="mt-6 mb-4 flex items-center gap-2">
            <Button variant="text">Sign In</Button>
            <a href="https://www.material-tailwind.com/blocks" target="_blank">
              <Button color="gray">blocks</Button>
            </a>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
