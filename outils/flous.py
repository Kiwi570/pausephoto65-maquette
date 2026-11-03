#!/usr/bin/env python3
"""Outils d'images propres à PausePhoto65 (à lancer après outils/images.py) :
- <nom>-flou.webp : petite version floue (32 px), fond de la « mise au point » avant l'image nette ;
- <nom>-<largeur native>.webp pour les images entre 640 et 1280 px (Grok en 1168 px, salle de mariage en 1200 px…) ;
- donnees/photos-infos.json : couleur dominante (teinte du fond de la galerie) et proportions réelles.
Usage : python3 outils/flous.py recu/lot.json
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps, ImageStat

RACINE = Path(__file__).resolve().parent.parent


def main(lot):
    infos = {}
    for e in json.loads(Path(lot).read_text()):
        src = RACINE / e["source"]
        nom = e["nom"]
        img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        w, h = img.size
        petit = img.copy()
        petit.thumbnail((32, 32 * h // w + 1))
        petit = petit.filter(ImageFilter.GaussianBlur(1.2))
        sortie = RACINE / "assets/images" / f"{nom}-flou.webp"
        sortie.parent.mkdir(parents=True, exist_ok=True)
        petit.save(sortie, "WEBP", quality=60)
        if w not in (640, 1280, 1920) and 640 < w < 1280:
            img.save(RACINE / "assets/images" / f"{nom}-{w}.webp", "WEBP", quality=80, method=6)
        moyenne = ImageStat.Stat(img.resize((64, 64))).mean
        infos[nom] = {"couleur": "#%02x%02x%02x" % tuple(int(c) for c in moyenne[:3]), "ratio": round(w / h, 4)}
    (RACINE / "donnees/photos-infos.json").write_text(json.dumps(infos, indent=1, ensure_ascii=False) + "\n")
    print(f"OK {len(infos)} images : flous, couleurs, proportions")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "recu/lot.json")
