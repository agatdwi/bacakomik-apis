const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
    try {
        const { data } = await axios.get(`https://bacakomik.one/${url}`);
        return cheerio.load(data);
    } catch (error) {
        throw new Error(error.message);
    }
}

function removeNonDigit(text) {
    return text.replace(/\D/g, "");
}

async function getLatestKomik() {
    const $ = await fetchHTML("komik-terbaru");
    const komikList = [];

    $(".animepost").each((_, el) => {
        komikList.push({
            title: $(el).find("h4").text().trim(),
            link: $(el).find("a").attr("href"),
            cover: $(el).find("img").attr("data-lazy-src"),
            chapter: removeNonDigit($(el).find(".lsch a").text().trim()),
            date: $(el).find(".datech").text().trim(),
            type: $(el).find("span.typeflag").hasClass("Manhwa") ? "manhwa" :
                  $(el).find("span.typeflag").hasClass("Manhua") ? "manhua" : "manga",
        });
    });

    return { komikList, nextPage: $(".next.page-numbers").length > 0 };
}

async function searchKomik(query, page) {
    const $ = await fetchHTML(`page/${page}/?s=${query}`);
    const komikList = [];

    $(".animepost").each((_, el) => {
        komikList.push({
            title: $(el).find("h4").text().trim(),
            link: $(el).find("a").attr("href"),
            cover: $(el).find("img").attr("src"),
            rating: $(el).find(".rating i").text().trim(),
            type: $(el).find("span.typeflag").hasClass("Manhwa") ? "manhwa" :
                  $(el).find("span.typeflag").hasClass("Manhua") ? "manhua" : "manga",
        });
    });

    return { komikList, nextPage: $(".next.page-numbers").length > 0 };
}

async function getPopularKomik(page) {
    const $ = await fetchHTML(`komik-populer/page/${page}`);
    const komikList = [];

    $(".animepost").each((_, el) => {
        komikList.push({
            title: $(el).find("h4").text().trim(),
            link: $(el).find("a").attr("href"),
            cover: $(el).find("img").attr("data-lazy-src"),
            rating: $(el).find(".rating i").text().trim(),
            type: $(el).find("span.typeflag").hasClass("Manhwa") ? "manhwa" :
                  $(el).find("span.typeflag").hasClass("Manhua") ? "manhua" : "manga",
        });
    });

    return { komikList, nextPage: $(".next.page-numbers").length > 0 };
}

async function getKomikDetail(komik) {
    const $ = await fetchHTML(`komik/${komik}`);
    return {
        title: $(".postbody h1").text().replace("Komik", "").trim(),
        cover: $(".postbody img").attr("data-lazy-src"),
        firstChapter: {
            title: $(".postbody .epsbr").first().find("span.barunew").text().replace("Chapter", "").trim(),
            link: $(".postbody .epsbr").first().find("a").attr("href"),
        },
        lastChapter: {
            title: $(".postbody .epsbr").last().find("span.barunew").text().replace("Chapter", "").trim(),
            link: $(".postbody .epsbr").last().find("a").attr("href"),
        },
        rating: $(".postbody .rtg").text().trim() || "0",
        synopsis: $(".postbody [itemprop='description']").text().trim(),
        genres: $(".postbody .genre-info a").map((_, el) => ({
            title: $(el).text().trim(),
            link: $(el).attr("href"),
        })).get(),
        chapters: $("#chapter_list li").map((_, el) => ({
            title: removeNonDigit($(el).find("span.lchx a").attr("href") || ""),
            link: $(el).find("span.lchx a").attr("href") || "",
            date: $(el).find("span.dt").text().trim(),
        })).get(),
    };
}

async function getChapterImages(chapter) {
    const $ = await fetchHTML(chapter);
    return {
        title: $(".dtlx h1").text().replace("Komik", "").trim(),
        images: $("#anjay_ini_id_kh img").map((_, el) => $(el).attr("data-lazy-src")).get(),
        nextPage: $(".nextprev a[rel='next']").length > 0,
    };
}

module.exports = {
    getLatestKomik,
    searchKomik,
    getPopularKomik,
    getKomikDetail,
    getChapterImages,
};
