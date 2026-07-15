export default async function handler(req, res) {
    const API_KEY = process.env.NEWS_API_KEY;

    const url =
        `https://api.thenewsapi.com/v1/news/all?` +
        `api_token=${API_KEY}` +
        `&search=cricket OR ICC OR IPL OR ODI OR T20 OR Test OR Virat Kohli OR Rohit Sharma OR MS Dhoni OR India cricket` +
        `&language=en` +
        `&limit=12` +
        `&sort=published_desc`;

    try {
        const response = await fetch(url);

        const data = await response.json();

        res.setHeader("Access-Control-Allow-Origin", "*");

        res.status(200).json(data);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Unable to fetch news."
        });

    }
}