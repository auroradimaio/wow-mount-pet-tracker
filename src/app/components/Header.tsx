import Image from "next/image";
import Pngegg from "../images/pngegg.png";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-center">
      <header className="bg-gray-900 text-white py-2 shadow-md rounded-[25px] w-full mx-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src={Pngegg}
              alt="Wow Logo"
              width={75}
              height={75}
              className="mr-2"></Image>
          </Link>

          <div className="space-x-4">
            <Link href="/character">
              <button className="bg-tranparent hover:bg-gray-800 text-[#c79c6e] text-3xl py-2 px-4 rounded-[25px]">
                Characters
              </button>
            </Link>
            <Link href="/mounts">
              <button className="bg-tranparent hover:bg-gray-800 text-[#c79c6e] text-3xl py-2 px-4 rounded-[25px]">
                Mounts
              </button>
            </Link>
            <Link href="/pets">
              <button className="bg-tranparent hover:bg-gray-800 text-[#c79c6e] text-3xl py-2 px-4 rounded-[25px]">
                Pets
              </button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
