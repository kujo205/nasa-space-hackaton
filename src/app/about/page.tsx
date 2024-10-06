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

const atricles = [
  {
    title: "What does our app do?",
    description:
      'Our app helps curious space researchers track the location of Landsat 8/9 satellites. Users can input their coordinates and choose whether to get historical images of the point they chose or photos of the soonest satellite pass. After entering all the details and clicking "submit", they will receive an email with all the data about their request (including location and max cloud coverage) and the type of photo they selected.  They will also receive a pinpointed pixel if they choose an option with the closest satellite pass. Besides receiving an email of satellite pass they are going to receive a notification on "n" day before it passes.\n',
    video: true,
  },
  {
    title: "About Us",
    description:
      "We are a team of ambitious Ukrainian software engineers and product\n        analysts dedicated to our careers and studying at the KPI University. We\n        view studying as a main objective of our lives and so, dedicate a hefty\n        amount of time to this very purpose. We are also very keen on the topic\n        of space, which is why this contest drew our attention. Additionally, we\n        believe it's important to expand the boundaries of our knowledge, so we\n        decided to utilize our skills to make the lives of Space explorers\n        easier.",
  },
];

export default function Page() {
  return (
    <div className="px-5 max-w-4xl w-full mx-auto min-h-screen items-center justify-items-center min-h-screen">
      {atricles.map((article) => (
        <article key={article.title}>
          <h2 className="font-bold text-3xl max-md:text-2xl mt-10">
            {article.title}
          </h2>
          <p className="mt-2 max-md:text-sm text-lg">{article.description}</p>

          {article.video && (
            <iframe
              className="m-auto mt-10 max-w-[90%]"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/wOuVQGZmZa8?si=rF3UT4WLp4xmT00v"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
        </article>
      ))}

      <div className="flex mt-10 flex-col gap-6">
        {members.map((member) => (
          <a href={member.linked} key={member.photo}>
            <Card className="bg-gray-800 hover:bg-gray-700">
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
                <Button
                  variant="link"
                  className="text-xl text-white font-semibold"
                >
                  {member.name}
                </Button>
                <p className="text-sm text-gray-400">{member.role}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
