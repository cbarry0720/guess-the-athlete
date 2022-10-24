from lib2to3.pytree import Node
from unittest import main
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
from unidecode import unidecode
import sys
import psycopg2

connection = psycopg2.connect(
    "dbname=gtadb user=postgres password=pgpassword host=localhost")
cur = connection.cursor()


def isNumber(n):
    try:
        float(n)
        return True
    except ValueError:
        return False


def getSoup(url):
    req = Request(url)
    client = urlopen(req)
    html = client.read()
    client.close()
    soup = BeautifulSoup(html, "html.parser")
    return soup


def updateNBA(soup: BeautifulSoup):
    players = soup.find_all("tr")
    for i, player in enumerate(players):
        if (i == 0):
            continue
        obj = {}
        header = player.th
        link = "https://www.basketball-reference.com" + player.a["href"]
        obj["link"] = link
        hof = header.text.find("*") > 0
        obj["hof"] = hof
        obj["name"] = header.text[0:len(
            header.text) - 1] if hof else header.text
        obj['name'] = unidecode(obj['name'])
        obj['name'] = obj['name'].replace("'", "").replace(".", "")
        tenure = player.find_all("td")
        obj["active"] = header.strong != None
        obj["from"] = int(tenure[0].text)
        obj["to"] = int(tenure[1].text)
        page = getSoup(link)
        info = page.find(id="info")
        obj["image"] = info.img["src"] if info.img != None else None
        stats = info.find("div", class_="p3").find_all("p")
        obj["per"] = float(stats[1].text) if isNumber(stats[1].text) else 0
        obj["ws"] = float(stats[3].text) if isNumber(stats[3].text) else 0
        bling = info.find(id="bling").find_all(
            "a") if info.find(id="bling") != None else []
        for b in bling:
            if (b.text.find("MVP") > 0 and b.text.find("Finals MVP") < 0 and b.text.find("AS") < 0):
                obj["mvps"] = int(b.text.split(
                    "x")[0]) if b.text.find("x") > 0 else 1
            elif (b.text.find("All Star") > 0):
                obj["allstars"] = int(b.text.split("x")[0])
        if "mvps" not in obj.keys():
            obj["mvps"] = 0
        if "allstars" not in obj.keys():
            obj["allstars"] = 0
        cur.execute(
            f"INSERT into \"ATHLETES\" (name, link, league, image, \"from\", \"to\", active, hof) values ('{obj.get('name')}', '{obj.get('link')}', '{obj.get('league')}', '{obj.get('image')}', {obj.get('from')}, {obj.get('to')}, {obj.get('active')}, {obj.get('hof')})")
        cur.execute(
            f"SELECT id from \"ATHLETES\" where link = '{obj.get('link')}'")
        id = cur.fetchall()[0][0]
        cur.execute(
            f"INSERT INTO nba_players values ({id}, {obj.get('mvps')}, {obj.get('allstars')}, {obj.get('per')}, {obj.get('ws')})")
        print(obj["name"])


def updateMLB(soup: BeautifulSoup):
    players = soup.find("div", id="div_players_").find_all("p")
    for i, player in enumerate(players):
        if (i == 0):
            continue
        obj = {'league': 'MLB'}
        obj['link'] = "https://www.baseball-reference.com" + \
            player.find('a')['href']
        page = getSoup(obj['link'])
        obj["active"] = player.find("b") != None
        mlbPlayer = False
        if not obj["active"]:
            leagues = page.find("table").findAll("td", {"data-stat": "lg_ID"})
            for l in leagues:
                if (l.text == "AL" or l.text == "NL"):
                    mlbPlayer = True
        else:
            mlbPlayer = True
        obj['name'] = unidecode(player.find("a").text).replace(
            "'", "").replace(".", "")
        if (not mlbPlayer):
            continue
        obj['hof'] = player.text.find("+") > 0
        tenure = player.text.split("(")[1].split("-")
        obj['from'] = int(tenure[0])
        obj['to'] = int(tenure[1].split(")")[0])
        info = page.find(id='info')
        bullets = info.find_all("p")
        for b in bullets:
            if b.text.find("Position") > 0:
                if (b.text.find("Pitcher") > 0 and b.text.find("and") > 0):
                    obj["position"] = "Hybrid"
                elif (b.text.find("Pitcher") > 0):
                    obj["position"] = "Pitcher"
                else:
                    obj["position"] = "Batter"
                break
        obj["image"] = info.img["src"] if info.img != None else None
        wartext = info.find("div", class_="p1").div.find_all("p")[-1].text
        obj["war"] = float(wartext) if isNumber(wartext) else 0.0
        bling = page.find(id="bling")
        arr = bling.find_all("li") if bling != None else []
        for award in arr:
            if (award.text.find("All-Star") > 0):
                obj["allstars"] = int(award.text.split("x")[0])
            elif (award.text.find("Cy Young") > 0):
                obj['cyyoungs'] = int(award.text.split(
                    "x")[0]) if award.text.find("x") > 0 else 1
            elif (award.text.find("Gold Glove") > 0):
                obj['ggs'] = int(award.text.split("x")[0]
                                 ) if award.text.find("x") > 0 else 1
            elif (award.text.find("Silver Slugger") > 0):
                obj['ss'] = int(award.text.split("x")[0]
                                ) if award.text.find("x") > 0 else 1
            elif (award.text.find("MVP") > 0 and award.text.find("WS") < 0 and award.text.find("AS") < 0):
                obj['mvps'] = int(award.text.split(
                    "x")[0]) if award.text.find("x") > 0 else 1
        if "allstars" not in obj.keys():
            obj["allstars"] = 0
        if "cyyoungs" not in obj.keys():
            obj["cyyoungs"] = 0
        if "ggs" not in obj.keys():
            obj["ggs"] = 0
        if "ss" not in obj.keys():
            obj["ss"] = 0
        if "mvps" not in obj.keys():
            obj["mvps"] = 0
        obj["link"] = obj["link"].replace("'", "//x27")
        obj["image"] = obj["image"].replace(
            "'", "//x27") if obj["image"] != None else None
        cur.execute(
            f"INSERT into \"ATHLETES\" (name, link, league, image, \"from\", \"to\", active, hof) values ('{obj.get('name')}', '{obj.get('link')}', '{obj.get('league')}', '{obj.get('image')}', {obj.get('from')}, {obj.get('to')}, {obj.get('active')}, {obj.get('hof')})")
        cur.execute(
            f"SELECT id from \"ATHLETES\" where link = '{obj.get('link')}'")
        id = cur.fetchall()[0][0]
        cur.execute(
            f"INSERT INTO mlb_players values ({id}, {obj.get('war')}, {obj.get('allstars')}, {obj.get('cyyoungs')}, {obj.get('mvps')}, {obj.get('ggs')}, {obj.get('ss')}, '{obj.get('position')}')")
        print(obj.get('name'))


def updateNFL(soup: BeautifulSoup):
    pass


def outputHTML(soup: BeautifulSoup):
    soup = soup.encode("utf-8")
    soup = str(soup)
    start = soup.find("<table")
    end = soup.find("</table>") + 8
    file = open("html.txt", "w")
    file.write(soup[start:end])
    file.close()


if __name__ == '__main__':
    argv = sys.argv
    if (argv[1] == "table"):
        soup = getSoup(argv[2])
        outputHTML(soup)
        exit()

    alphabet = "abcdefghijklmnopqrstuvwxyz"
    for letter in alphabet:
        if (len(argv) == 1):
            soup = getSoup(
                "https://www.basketball-reference.com/players/" + letter)
            updateNBA(soup)
            soup = getSoup(
                "https://www.pro-football-reference.com/players/" + letter.capitalize())
            updateNFL(soup)
            soup = getSoup(
                "https://www.baseball-reference.com/players/" + letter)
            updateMLB(soup)
        elif (argv[1] == "NBA"):
            soup = getSoup(
                "https://www.basketball-reference.com/players/" + letter)
            updateNBA(soup)
        elif (argv[1] == "NFL"):
            soup = getSoup(
                "https://www.pro-football-reference.com/players/" + letter.capitalize())
            updateNFL(soup)
        else:
            soup = getSoup(
                "https://www.baseball-reference.com/players/" + letter)
            updateMLB(soup)
        connection.commit()
    cur.close()
    connection.close()
