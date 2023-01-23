const response = require("../utils/response")
var axios = require('axios');
require("dotenv").config();
const { PEXELS_API_KEY, UNSPLASH_API_KEY } = process.env;

exports.getImages = async (req, res) => {
    const { page, query } = req.query
    if (!page || !query) {
        response({ res, error: "Please provide page and query" });
    }
    try {
        const images = await getAllImages(page, query)
        console.log(page, query);
        const pexelImages = images[0].data.photos.map((photo) => {
            return {
                imageURL: photo.src.original,
                altText: photo.alt,
                user: {
                    name: photo.photographer,
                    profile: photo.photographer_url,
                    profileImage: ""
                }
            }
        })


        const unsplashImages = images[1].data.results.map((photo) => {
            return {
                imageURL: photo.urls.raw,
                altText: photo.alt_description,
                user: {
                    name: photo.user.name,
                    profile: photo.user.links.html,
                    profileImage: photo.user.profile_image.medium
                }
            }
        })
        console.log("here");


        const imagesMap = pexelImages.concat(unsplashImages)
        return response({ res, data: imagesMap.length > 0 ? imagesMap : null });
    } catch (error) {
        response({ res, error });
    }
}

const getAllImages = (page = 1, query = '') => {
    const pexelsConfig = {
        method: 'get',
        url: `https://api.pexels.com/v1/search?page=${page}&per_page=5&query=${query}`,
        headers: {
            'Authorization': `${PEXELS_API_KEY}`
        }
    };

    const unsplashConfig = {
        method: 'get',
        url: `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=4`,
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
        }
    };
    return axios.all([axios(pexelsConfig), axios(unsplashConfig)])
}