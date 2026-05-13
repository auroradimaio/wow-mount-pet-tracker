"use client";
import Image from "next/image";
import Pngegg from "../images/pngegg.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/character", label: "Characters" },
  { href: "/mounts", label: "Mounts" },
  { href: "/pets", label: "Pets" },
];

export default function Header() {
  const pathName = usePathname();

  return (
    <div className="flex justify-center">
      <header className="bg-gray-900 text-white py-2 shadow-md rounded-[25px] w-full mx-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <Image src={Pngegg} alt="WoW Logo" width={75} height={75} className="mr-2" />
          </Link>

          <nav className="space-x-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-[#c79c6e] text-3xl py-2 px-4 rounded-[25px] transition-colors ${
                  pathName === href ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}
