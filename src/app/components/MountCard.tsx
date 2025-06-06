import Image from "next/image";
import Invincible from "../images/invincible.webp";

export default function MountCard({
  name,
  icon,
}: {
  name: string;
  icon: string;
}) {
  return (
    <div className="flex flex-col gap-4 items-start ml-6 mt-10 items-center">
      {icon ? (
        <Image src={icon} height={200} width={200} alt={`${name} Mount`} />
      ) : (
        <div className="bg-gray-400 h-48 w-48 flex justify-center items-center">
          <p className="text-white text-xl">No Image</p>
        </div>
      )}
      <p className="mt-2 text-xl">{name}</p>
    </div>
  );
}
