'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MovieDetailsProps {
    id: string;
    title: string;
    poster: string;
    rating: number;
    details: string;
    trailer: string;
    genres: string[];
    duration?: number;
    releaseDate?: string;
    currentlyRunning?: boolean;
    comingSoon?: boolean;
}

const UGA = {
    black: "#000000",
    nearBlack: "#0b0b0b",
    dark: "#151515",
    gray: "#d1d5db",
    white: "#ffffff",
    red: "#ba0c2f",
    redDark: "#8a0a23",
    border: "#2a2a2a",
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: 32,
        marginBottom: 32,
    },
    posterSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    poster: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    },
    posterPlaceholder: {
        width: "100%",
        height: 600,
        background: UGA.dark,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: UGA.gray,
        fontSize: 18,
        border: `1px solid ${UGA.border}`,
    },
    detailsSection: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: 900,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    meta: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 16,
        flexWrap: "wrap",
    },
    rating: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: UGA.red,
        padding: "6px 12px",
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 700,
    },
    status: {
        padding: "6px 12px",
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 700,
        background: UGA.dark,
        border: `1px solid ${UGA.border}`,
    },
    statusRunning: {
        background: "#065f46",
        color: "#10b981",
        border: "1px solid #10b981",
    },
    statusComing: {
        background: "#78350f",
        color: "#fbbf24",
        border: "1px solid #fbbf24",
    },
    genres: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
    },
    genre: {
        padding: "4px 12px",
        borderRadius: 16,
        background: UGA.dark,
        border: `1px solid ${UGA.border}`,
        fontSize: 12,
        fontWeight: 600,
    },
    description: {
        fontSize: 16,
        lineHeight: 1.6,
        color: UGA.gray,
        marginBottom: 24,
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 24,
    },
    infoItem: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: UGA.gray,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 600,
    },
    actions: {
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
    },
    btnPrimary: {
        padding: "12px 24px",
        borderRadius: 12,
        border: `1px solid ${UGA.red}`,
        background: UGA.red,
        color: UGA.white,
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 16,
        textDecoration: "none",
        display: "inline-block",
    },
    btnSecondary: {
        padding: "12px 24px",
        borderRadius: 12,
        border: `1px solid ${UGA.border}`,
        background: UGA.dark,
        color: UGA.white,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 16,
        textDecoration: "none",
        display: "inline-block",
    },
    trailerSection: {
        marginTop: 32,
        padding: 24,
        background: UGA.nearBlack,
        borderRadius: 16,
        border: `1px solid ${UGA.border}`,
    },
    trailerTitle: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 16,
    },
    trailerContainer: {
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%", // 16:9 aspect ratio
        background: UGA.black,
        borderRadius: 8,
        overflow: "hidden",
    },
    trailerIframe: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "none",
    },
    showtimesSection: {
        marginTop: 32,
        padding: 24,
        background: UGA.nearBlack,
        borderRadius: 16,
        border: `1px solid ${UGA.border}`,
    },
    showtimesTitle: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 16,
    },
    showtimesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: 12,
    },
    showtimeBtn: {
        padding: "12px 16px",
        borderRadius: 8,
        border: `1px solid ${UGA.border}`,
        background: UGA.dark,
        color: UGA.white,
        cursor: "pointer",
        fontWeight: 600,
        textAlign: "center",
        transition: "all 0.2s",
    },
    showtimeBtnHover: {
        background: UGA.red,
        borderColor: UGA.red,
    },
};

const SHOWTIMES = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];

function deriveStatus(movie: MovieDetailsProps) {
    if (movie.currentlyRunning) return "RUNNING";
    if (movie.comingSoon) return "COMING_SOON";
    if (!movie.releaseDate) return "RUNNING";
    return new Date(movie.releaseDate) > new Date() ? "COMING_SOON" : "RUNNING";
}

function ytId(url?: string) {
    if (!url) return;
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || undefined;
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || undefined;
    } catch {}
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
    id,
    title,
    poster,
    rating,
    details,
    trailer,
    genres,
    duration,
    releaseDate,
    currentlyRunning,
    comingSoon
}) => {
    const router = useRouter();
    const [hoveredShowtime, setHoveredShowtime] = useState<string | null>(null);
    const status = deriveStatus({ id, title, poster, rating, details, trailer, genres, duration, releaseDate, currentlyRunning, comingSoon });

    const handleBookShowtime = (showtime: string) => {
        router.push(`/Booking?movieId=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&showtime=${encodeURIComponent(showtime)}`);
    };

    return (
        <div>
            <div style={styles.container}>
                <div style={styles.posterSection}>
                    {poster ? (
                        <img 
                            src={poster} 
                            alt={`${title} poster`} 
                            style={styles.poster}
                        />
                    ) : (
                        <div style={styles.posterPlaceholder}>
                            No Poster Available
                        </div>
                    )}
                </div>

                <div style={styles.detailsSection}>
                    <h1 style={styles.title}>{title}</h1>
                    
                    <div style={styles.meta}>
                        {rating > 0 && (
                            <div style={styles.rating}>
                                ⭐ {rating}/10
                            </div>
                        )}
                        <div style={{
                            ...styles.status,
                            ...(status === "RUNNING" ? styles.statusRunning : styles.statusComing)
                        }}>
                            {status === "RUNNING" ? "Now Playing" : "Coming Soon"}
                        </div>
                    </div>

                    <div style={styles.genres}>
                        {genres.map((genre) => (
                            <span key={genre} style={styles.genre}>
                                {genre}
                            </span>
                        ))}
                    </div>

                    {details && (
                        <p style={styles.description}>{details}</p>
                    )}

                    <div style={styles.infoGrid}>
                        {duration && (
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Duration</span>
                                <span style={styles.infoValue}>{duration} minutes</span>
                            </div>
                        )}
                        {releaseDate && (
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Release Date</span>
                                <span style={styles.infoValue}>
                                    {new Date(releaseDate).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={styles.actions}>
                        <button 
                            style={styles.btnPrimary}
                            onClick={() => router.push(`/Booking?movieId=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}`)}
                        >
                            Book Tickets
                        </button>
                        {trailer && (
                            <button 
                                style={styles.btnSecondary}
                                onClick={() => {
                                    const videoId = ytId(trailer);
                                    if (videoId) {
                                        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                                    }
                                }}
                            >
                                Watch Trailer
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {trailer && (
                <div style={styles.trailerSection}>
                    <h3 style={styles.trailerTitle}>Trailer</h3>
                    <div style={styles.trailerContainer}>
                        {ytId(trailer) ? (
                            <iframe
                                style={styles.trailerIframe}
                                src={`https://www.youtube.com/embed/${ytId(trailer)}`}
                                title={`${title} Trailer`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video 
                                style={styles.trailerIframe}
                                src={trailer} 
                                controls 
                            />
                        )}
                    </div>
                </div>
            )}

            <div style={styles.showtimesSection}>
                <h3 style={styles.showtimesTitle}>Showtimes</h3>
                <div style={styles.showtimesGrid}>
                    {SHOWTIMES.map((showtime) => (
                        <button
                            key={showtime}
                            style={{
                                ...styles.showtimeBtn,
                                ...(hoveredShowtime === showtime ? styles.showtimeBtnHover : {})
                            }}
                            onClick={() => handleBookShowtime(showtime)}
                            onMouseEnter={() => setHoveredShowtime(showtime)}
                            onMouseLeave={() => setHoveredShowtime(null)}
                        >
                            {showtime}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;