export default async function handler(req, res) {
  const API_KEY = process.env.GNEWS_API_KEY;

  const url =
    `https://gnews.io/api/v4/search?q=cricket OR IPL OR ICC OR ODI OR T20 OR Test OR Virat Kohli OR Rohit Sharma OR MS Dhoni&lang=en&max=12&apikey=${API_KEY}`;

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