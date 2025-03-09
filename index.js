const express = require("express");
const cors = require("cors");
const scrape = require("./scrape");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json();

app.get("/", (req, res) => {
    res.json({
        message: "API Scraper BacaKomik",
        endpoints: {
            latest: "/latest/page/:page",
            search: "/search/:query/page/:page",
            popular: "/populer/page/:page",
            komikDetail: "/komik/:komik",
            chapterImages: "/chapter/:chapter",
        },
    });
});

app.get("/latest/page/:page", async (req, res) => {
    try {
        res.json(await scrape.getLatestKomik());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/search/:query/page/:page", async (req, res) => {
    try {
        res.json(await scrape.searchKomik(req.params.query, req.params.page));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/populer/page/:page", async (req, res) => {
    try {
        res.json(await scrape.getPopularKomik(req.params.page));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/komik/:komik", async (req, res) => {
    try {
        res.json(await scrape.getKomikDetail(req.params.komik));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/chapter/:chapter", async (req, res) => {
    try {
        res.json(await scrape.getChapterImages(req.params.chapter));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
