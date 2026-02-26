/*!
 * Copyright (c) 2025 Faizal Chan.
 * Licensed under the MIT License.

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
