import Image from "next/image";

export default function MountCard({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="flex flex-col gap-4 items-center ml-6 mt-10">
      {icon ? (
        <Image className="rounded-lg" src={icon} height={200} width={200} alt={name} />
      ) : (
        <div className="bg-gray-800 border border-gray-700 h-48 w-48 flex justify-center items-center rounded-lg">
          <p className="text-gray-500 text-sm">No Image</p>
        </div>
      )}
      <p className="mt-2 text-xl">{name}</p>
    </div>
  );
}
