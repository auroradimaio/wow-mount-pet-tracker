import Image from "next/image";
import CharacterNotFound from "../../images/CharacterNotFound.png";
export default function CharacterDoesNotExist() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-4xl">Character does not exist</div>
      <Image
        src={CharacterNotFound}
        alt="CharacterNotFound"
        width={400}
        height={400}
      />
    </div>
  );
}
