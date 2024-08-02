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
  PaginationEllipsis,
} from "./ui/pagination";

const Albums = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const { theme, setTheme } = useTheme();

  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=Queen&api_key=${process.env.API_KEY}&format=json`;

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
        console.error("Fetching data failed:", error);
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

  const renderPaginationItems = () => {
    const items = [];
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={1 === currentPage}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      items.push(<PaginationEllipsis key="start-ellipsis" />);
    }
    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === currentPage}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    if (currentPage < totalPages - 2) {
      items.push(<PaginationEllipsis key="end-ellipsis" />);
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={totalPages === currentPage}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-5">
        <h1 className="md:text-5xl text-2xl font-bold">Artists</h1>
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
                <CardTitle className="text-xl font-semibold text-blue-950">
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
        <PaginationContent className="flex justify-center">
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className="disabled:opacity-50 cursor-pointer"
            disabled={currentPage === 1}
          />
          <div className="hidden md:flex">{renderPaginationItems()}</div>
          <div className="flex md:hidden">
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  isActive={currentPage === 1}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage > 2 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(currentPage)}
                isActive={true}
                className="cursor-pointer"
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            {currentPage < totalPages - 1 && <PaginationEllipsis />}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  isActive={currentPage === totalPages}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
          </div>
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
