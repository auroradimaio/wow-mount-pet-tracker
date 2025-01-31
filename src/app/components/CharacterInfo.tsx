import Image from "next/image";
import Pngegg2 from "../images/pngegg (2).png";

export default function CharacterInfo() {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] gap-2 p-4 rounded-lg items-center">
      <Image
        src={Pngegg2}
        alt="AllianceOrHorde Logo"
        width={130}
        height={130}
        className="ml-4"></Image>
      <div className="flex flex-col justify-center gap-2">
        <div className="text-4xl">Character Name</div>
        <div className="text-xl">Character Title</div>
      </div>
      <div className="flex flex-col justify-center gap-2">
        <div className="text-4xl">xx Mounts Collected</div>
        <div className="text-4xl">xx Pets Collected</div>
      </div>
    </div>
  );
}
