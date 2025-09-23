import React from "react";
import Image from "next/image";

interface movieProps {
    id: number;
    title: string;
    poster: string;
    rating: number;
    genres: string[];
    currentlyRunning: boolean;
    comingSoon: boolean;
    //currentlyRunning and comingSoon tell which section of the home screen the movie card will be
    //possibly add functions that the movie card uses
}

const Movie: React.FC<movieProps> = ({
    id,
    title,
    poster,
    rating,
    genres,
    currentlyRunning,
    comingSoon
}) => {
    //Where the html comes into play
    return (
        <div>
            <p>small movie card visible from home screen</p>
        </div>
    )
}