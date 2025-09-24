import React from "react";
import Image from "next/image";

interface showtimesProps {
    id: number;
    title: string;
    times: string[] //times can be changed to any better data type
    //possibly add functions that the showtimes card uses
}

const Showtimes: React.FC<showtimesProps> = ({
    id,
    title,
    times
}) => {
    //Where the html comes into play
    return (
        <div>
            <p>screen-filling card that displays the available showtimes of
                the selected movie. Clicking a showtime brings the user to
                a different page where the actual ordering of tickets comes into play.
            </p>
        </div>
    )
}

export default Showtimes;