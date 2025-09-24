import React from "react";
import Image from "next/image";

interface movieDetailsProps {
    id: number;
    title: string;
    poster: string;
    rating: number;
    details: string;
    trailer: string;
    genres: string[];
    //possibly add functions that the movieDetails card uses
}

const MovieDetails: React.FC<movieDetailsProps> = ({
    id,
    title,
    poster,
    rating,
    details,
    trailer,
    genres
}) => {
    //Where the html comes into play
    return (
        <div>
            <p>screen-filling card that displays the full details of a
                selected movie
            </p>
        </div>
    )
}

export default MovieDetails;