'use client';

import {useState} from 'react';
import YouTube, {YouTubeProps} from 'react-youtube';

const VideoPlayer = ({video}: any) => {
	const [isEnded, setIsEnded] = useState(false);
	const [autoPlay, setAutoPlay] = useState(0);
	const onEnd: YouTubeProps['onEnd'] = () => {
		// Hide or replace the video when it ends
		setIsEnded(true);
		setAutoPlay(0); // Reset autoplay to 0 when video ends
	};

	const opts: YouTubeProps['opts'] = {
		width: '100%',
		height: '200',
		playerVars: {
			autoplay: autoPlay, // Auto-play the video on load
			rel: 0, // show related videos only from same channel
			modestbranding: 1, // minimal YouTube branding
			controls: 1,
		},
	};
	const handlePlayClick = () => {
		setIsEnded(false);
		setAutoPlay(1); // Enable autoplay when the play button is clicked
	};

	return (
		<div className="video-card">
			{!isEnded ? (
				<YouTube videoId={video.video_id} opts={opts} onEnd={onEnd} />
			) : (
				<div className="thumbnail-container" onClick={handlePlayClick}>
					<img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
					<div className="play-button">
						<svg width="50" height="50" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z" fill="#fff" />
						</svg>
					</div>
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
