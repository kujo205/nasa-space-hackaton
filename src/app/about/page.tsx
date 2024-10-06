import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const members = [
  {
    name: "Ivan Kuts",
    photo: "/ivan.jpg",
    role: "Team Lead, Full-stack",
    linked: "https://www.linkedin.com/in/ivan-kuts-a52114199/",
  },
  {
    name: "Kryvokhata Maria",
    photo: "/maria.jpg",
    role: "Designer, Product manager, Data analyst",
    linked: "https://www.linkedin.com/in/mariia-kryvokhata/",
  },
  {
    name: "Max Siryk",
    photo: "/maks.png",
    role: "CTO, full-stack",
    linked: "https://www.linkedin.com/in/max-siryk/",
  },
];

export default function Page() {
  return (
    <div className="max-w-4xl w-full mx-auto min-h-screen items-center justify-items-center min-h-screen">
      <h2 className="font-bold text-3xl mt-20">About Us</h2>
      <p className="mt-2 text-lg">
        We are a team of ambitious Ukrainian software engineers and product
        analysts dedicated to our careers and studying at the KPI University. We
        view studying as a main objective of our lives and so, dedicate a hefty
        amount of time to this very purpose. We are also very keen on the topic
        of space, which is why this contest drew our attention. Additionally, we
        believe it's important to expand the boundaries of our knowledge, so we
        decided to utilize our skills to make the lives of Space explorers
        easier.
      </p>

      <div className="flex mt-10 flex-col gap-6">
        {members.map((member) => (
          <Card key={member.photo} className="bg-gray-800">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                <Image
                  src={member.photo}
                  alt={`Team Member ${member.name}`}
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <a href={member.linked}>
                <Button
                  variant="link"
                  className="text-xl text-white font-semibold"
                >
                  {member.name}
                </Button>
              </a>
              <p className="text-sm text-gray-400">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
