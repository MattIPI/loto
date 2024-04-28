//https://ocr.space/OCRAPI
// Les 25k premiers appels sont gratuits
// Soit il rentre ses grilles à la main
// On donne accès à 10 scans offerts par mois (2 loto)
// Au delà, on demande d'acheter des crédits (1 crédit = 1 scan validé)
// L'utilisateur peut voir ses crédits disponibles sur l'appli

import { processSpaceOcrOutputGrid } from './space-ocr-output-processing';

export const processImageLocally = async (image: string): Promise<LotoGrid> => {
    // call API pour space ocr
    // parse le résultat
    // process grid
    try {
        console.log('sending request ...');

        const myHeaders = new Headers();
        myHeaders.append('apiKey', 'K83522676888957');

        const formdata = new FormData();
        formdata.append('isOverlayRequired', 'true');
        formdata.append('base64Image', 'data:image/jpeg;base64,' + image);
        formdata.append('OCREngine', '2');
        formdata.append('fileType', 'JPG');
        formdata.append('detectOrientation', 'true');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        const request = await fetch('https://api.ocr.space/parse/image', requestOptions);
        const data = await request.json();

        const grid = processSpaceOcrOutputGrid(data.ParsedResults[0].TextOverlay.Lines);
        return grid;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
