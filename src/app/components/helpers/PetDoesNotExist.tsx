import Image from "next/image";
import CharacterNotFound from "../../images/CharacterNotFound.png";

export default function PetDoesNotExist() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-4xl">Not found</div>
      <Image src={CharacterNotFound} alt="Not found" width={400} height={400} />
    </div>
  );
}
