// Public configuration for UI components

import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { SpotifyIcon } from "@/components/icons/SpotifyIcon";

// Public API usernames (also defined in config.server.js)
export const CHESS_USERNAME = "javablob";

// Social media links
export const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/william-a-hao/",
    Icon: LinkedInIcon,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/william.a.hao/",
    Icon: InstagramIcon,
  },
  {
    name: "GitHub",
    url: "https://github.com/williamhao99",
    Icon: GitHubIcon,
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/user/williamhao99?si=a55b81b68fab41dc",
    Icon: SpotifyIcon,
  },
];

// Navigation links
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/blog", label: "Blog" },
  { href: "/now", label: "Now" },
];

// Footer navigation (excludes home)
export const footerNavLinks = navLinks.filter((link) => link.href !== "/");

// Site metadata
export const siteMetadata = {
  title: "William Hao",
  description: "UT Austin '28, Computer Science + Mathematics",
  author: "William Hao",
  siteUrl: "https://willhao.com",
};
