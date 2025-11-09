import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import config from "@/includes/config";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  id: string;
  character_avatar_url: string;
  character_name: string;
  author_notes: string;
}

export function ProjectCard({ id, character_avatar_url, character_name, author_notes }: ProjectCardProps) {
  const router = useRouter();
  return (
    <Card color="transparent" shadow={false}>
      <CardHeader floated={false} className="mx-0 mt-0 mb-6 h-48">
        <Image
          src={config.BACKENDSITEURL + "/uploads/characters/avatar-img/" + character_avatar_url}
          alt={character_name}
          width={768}
          height={768}
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody className="p-0">
        {/* <a
          href="#"
          className="text-blue-gray-900 transition-colors hover:text-gray-800"
        >
          <Typography variant="h5" className="mb-2">
            {character_name}
          </Typography>
        </a> */}
        <Link href={`/chat/${id}`}>
          <Typography variant="h5" className="mb-2">
            {character_name}
          </Typography>
        </Link>
        <Typography className="mb-6 font-normal !text-gray-500">
          {author_notes}
        </Typography>
        <Button color="gray" size="sm" onClick={() => router.push(`/chat/${id}`)}>
          See details
        </Button>
      </CardBody>
    </Card>
  );
}

export default ProjectCard;
