import Image from "next/image";
import worgenitsfine from "../../images/worgenitsfine.jpg";

export default function CharacterDoesNotHaveData({
  type,
}: {
  type: "mounts" | "pets";
}) {
  return (
    <div className="flex flex-col justify-center items-center col-span-5">
      <div className="text-4xl">Character does not have {type} data</div>
      <Image src={worgenitsfine} alt="worgenitsfine" width={400} height={400} />
    </div>
  );
}
