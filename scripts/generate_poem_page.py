#!/usr/bin/env python3
"""Generate a poem HTML page from template.

Usage examples:
  python scripts/generate_poem_page.py --slug robjua --title "Pienso que en este momento" \
    --author "Roberto Juarroz" --dates "(1925–1995)" --badges "XX c.,Spanish,Poesía vertical" \
    --poem-file poem.txt --credit "Roberto Juarroz. Poesía vertical (1958–1975)."

If --poem-og-file is omitted, the ES text will be used for OG panel.
"""
import argparse
from pathlib import Path

TEMPLATE = Path(__file__).resolve().parents[1] / "pages" / "poetry" / "poem_template.html"
OUT_DIR = Path(__file__).resolve().parents[1] / "pages" / "poetry"


def load_text(path: Path) -> str:
    return path.read_text(encoding="utf-8").rstrip()


def make_badges(badges_csv: str) -> str:
    if not badges_csv:
        return ""
    parts = [b.strip() for b in badges_csv.split(",") if b.strip()]
    return "\n      ".join([f'<span class="badge">{p}</span>' for p in parts])


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--slug", required=True, help="output filename (no extension)")
    p.add_argument("--title", required=True)
    p.add_argument("--author", required=True)
    p.add_argument("--dates", default="")
    p.add_argument("--lede", default="")
    p.add_argument("--badges", default="")
    p.add_argument("--author-img", default="authors/{slug}.jpg")
    p.add_argument("--poem-file", type=Path, required=True)
    p.add_argument("--poem-og-file", type=Path)
    p.add_argument("--credit", default="")
    p.add_argument("--source-note", default="")
    args = p.parse_args()

    tpl = TEMPLATE.read_text(encoding="utf-8")

    poem_es = load_text(args.poem_file)
    poem_og = load_text(args.poem_og_file) if args.poem_og_file else poem_es

    badges_html = make_badges(args.badges)

    author_img = args.author_img.format(slug=args.slug)

    out = tpl.replace("%%TITLE%%", args.title)
    out = out.replace("%%LEDE%%", args.lede or f"{args.author} {args.dates}.")
    out = out.replace("%%BADGES%%", badges_html)
    out = out.replace("%%AUTHOR_IMG%%", author_img)
    out = out.replace("%%AUTHOR%%", args.author)
    out = out.replace("%%AUTHOR_DATES%%", f"{args.dates}" if args.dates else "")
    out = out.replace("%%POEM_ES%%", poem_es)
    out = out.replace("%%POEM_OG%%", poem_og)
    out = out.replace("%%CREDIT%%", args.credit)
    out = out.replace("%%SOURCE_NOTE%%", args.source_note)

    out_path = OUT_DIR / f"{args.slug}.html"
    out_path.write_text(out, encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
