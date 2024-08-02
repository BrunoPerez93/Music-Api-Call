"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const Albums = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const { theme, setTheme } = useTheme();

  const apiUrl =
    "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=Queen&api_key=4fbc1faf41a9a67fa4be36d4c8b6095f&format=json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.similarartists || data.similarartists.artist.length === 0)
    return <p>No data available</p>;

  const similarArtists = data.similarartists.artist;
  const totalItems = similarArtists.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = similarArtists.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Artists</h1>
        <Button
          onClick={handleThemeToggle}
          variant="outline"
          size="icon"
          className="relative"
        >
          {theme === "dark" ? (
            <Sun className="h-[1.5rem] w-[1.5rem] transition-transform duration-300" />
          ) : (
            <Moon className="h-[1.5rem] w-[1.5rem] transition-transform duration-300" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {currentItems.map((artist, index) => (
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
                <CardTitle className="text-xl font-semibold">
                  {artist.name}
                </CardTitle>
                <Button asChild>
                  <Link
                    href={artist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    More info
                  </Link>
                </Button>
              </CardHeader>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className="disabled:opacity-50 cursor-pointer"
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                isActive={i + 1 === currentPage}
                className="cursor-pointer"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            className="disabled:opacity-50 cursor-pointer"
            disabled={currentPage === totalPages}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Albums;
