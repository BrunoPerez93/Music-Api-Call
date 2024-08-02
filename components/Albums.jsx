"use client";

import { useState, useEffect } from "react";
import ArtistCard from "./ArtistCard";
import ThemeToggleButton from "./ThemeToggleButton";
import PaginationItems from "./PaginationItems";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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

  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=Queen&api_key=${process.env.NEXT_PUBLIC_API_KEY}&format=json`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
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

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-5">
        <h1 className="md:text-5xl text-2xl font-bold">Artists</h1>
        <ThemeToggleButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {currentItems.map((artist, index) => (
          <ArtistCard artist={artist} index={index} key={index} />
        ))}
      </div>
      <Pagination>
        <PaginationContent className="flex justify-center">
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className="disabled:opacity-50 cursor-pointer"
            disabled={currentPage === 1}
          />
          <div className="hidden md:flex">
            <PaginationItems
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
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
