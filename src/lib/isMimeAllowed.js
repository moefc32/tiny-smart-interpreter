const whitelist = [
    // documents
    'application/javascript',
    'application/json',
    'application/pdf',
    'application/xml',
    'text/*',

    // images
    'image/jpeg',
    'image/png',
    'image/webp',

    // videos
    'video/3gpp',
    'video/mp4',
    'video/mpeg',
    'video/mpegps',
    'video/mpg',
    'video/quicktime',
    'video/webm',
    'video/wmv',
    'video/x-flv',

    // audio
    'audio/aac',
    'audio/flac',
    'audio/m4a',
    'audio/mp3',
    'audio/mp4',
    'audio/mpeg',
    'audio/mpga',
    'audio/opus',
    'audio/pcm',
    'audio/wav',
    'audio/webm',
];

export default function isMimeAllowed(mime) {
    return whitelist.some((type) => {
        if (type.endsWith('/*')) {
            const base = type.split('/')[0];
            return mime.startsWith(base + '/');
        }

        return mime === type;
    });
}
