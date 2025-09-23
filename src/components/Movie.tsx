import React from "react";
import Image from "next/image";

interface movieProps {
    id: number;
    title: string;
    poster: string;
    rating: number;
    genres: string[];
    //possibly add functions that the movie card uses
}

const Movie: React.FC<movieProps> = ({
    id,
    title,
    poster,
    rating,
    genres,
}) => {
    //Where the html comes into play
    return (
        <div>
            <p>small movie card visible from home screen</p>
        </div>
    )
}