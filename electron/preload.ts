const fs = require('fs');
const { contextBridge, ipcRenderer } = require('electron');
const musicMetadata = require('music-metadata');
const mime = require('mime-types');
const { v4: uuid } = require('uuid');

contextBridge.exposeInMainWorld('electron', {
    getFileMetadata: async (path) => {
        const {
            common: {
                album,
                albumartist: albumArtists,
                artist: artists,
                disk: { no: discNumber, of: discCount },
                genre,
                picture: [
                    { data: pictureBuffer, format: pictureFormat } = {
                        data: null,
                        format: null
                    }
                ] = [],
                title,
                track: { no: trackNumber },
                year,
                ...commonMeta
            },
            format: { duration, codec },
            ...metadata
        } = await musicMetadata.parseFile(path);

        console.log({ commonMeta, metadata });

        return {
            id: uuid(),
            title,
            artists,
            albumArtists,
            album,
            genre: genre.join(' ').trim(),
            year,
            duration,
            trackNumber,
            discNumber,
            discCount,
            cover: pictureBuffer
                ? `data:${pictureFormat};base64,${pictureBuffer.toString(
                      'base64'
                  )}`
                : '',
            codec
        };
    }
});
