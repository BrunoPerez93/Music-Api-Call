import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const ArtistCard = ({artist, index}) => {
  return (
    <Card
      key={`${artist.mbid}-${index}`}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img
        src={artist.image[3]["#text"]}
        alt={artist.name}
        className="w-full h-48 object-cover"
      />
      <CardContent>
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-semibold text-blue-950">
            {artist.name}
          </CardTitle>
          <Button asChild>
            <Link
              href={artist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:bg-slate-400 dark:hover:bg-blue-700 dark:bg-gray-400"
            >
              More info
            </Link>
          </Button>
        </CardHeader>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
