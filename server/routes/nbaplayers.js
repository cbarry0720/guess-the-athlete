const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();
const app = express();

router.get("/update", async function(req, res){
    axios.get("https://www.basketball-reference.com/players/a").then(async function(e){
        let $ = cheerio.load(e.data);
        list = []
        $("tr").each(async function(i, e){
            if(i == 0){
                return;
            }
            let obj = {}
            let header = $(this).find("th");
            let link = "https://www.basketball-reference.com" + $(this).find("a").attr("href");
            let hof = header.text().includes("*");
            obj["name"] = hof ? header.text().substring(0, header.text().length-1) : header.text();
            obj["hof"] = hof;
            let arr = $(this).find("td").toArray();
            arr.forEach(function(e, i){
                let text = $(e).text();
                if(i == 0){
                    obj["from"] = text;
                }else if(i == 1){
                    obj["to"] = text;
                }
            });
            if(i != 1){
                return;
            }
            let table = await axios.get(link);
            let c = cheerio.load(table.data);
            c("tfoot:first").find("tr:first").find("td").toArray().forEach(function(e, k){
                if(k == 28){
                    obj["ppg"] = parseFloat(c(e).text());
                }else if(k == 23){
                    obj["apg"] = parseFloat(c(e).text());
                }else if(k == 22){
                    obj["rpg"] = parseFloat(c(e).text());
                }
            });
            console.log(obj)
            list.push(obj);
            console.log(list)
        })
        console.log(list)
    }).catch(function(err){
        res.send(err)
    })
});

module.exports = router;