#!/usr/bin/env python
"""
Optimiza un catalogo PDF para verlo con mas fluidez en dispositivos moviles.

Uso:
  python optimizar_catalogo_movil.py "assets/Catalogo original.pdf"

Opcional:
  python optimizar_catalogo_movil.py "assets/Catalogo original.pdf" -o "assets/catalogo_mobile.pdf"
  python optimizar_catalogo_movil.py "assets/Catalogo original.pdf" --dpi 120 --quality 75

Si no indicas salida, crea un archivo en la misma carpeta con sufijo _mobile.pdf.
Ejemplo:
  assets/Catálogo 2026-2027_v2.pdf
  assets/Catalogo_2026-2027_v2_mobile.pdf
"""

from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from pathlib import Path


DEFAULT_DPI = 144
DEFAULT_QUALITY = 78


def import_pymupdf():
    try:
        import fitz  # type: ignore

        return fitz
    except ImportError:
        print(
            "Falta la libreria PyMuPDF.\n"
            "Instalala con:\n"
            "  python -m pip install pymupdf",
            file=sys.stderr,
        )
        raise SystemExit(1)


def slugify_filename(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = re.sub(r"[^A-Za-z0-9._-]+", "_", ascii_text)
    ascii_text = re.sub(r"_+", "_", ascii_text).strip("._-")
    return ascii_text or "catalogo"


def default_output_path(input_path: Path) -> Path:
    safe_stem = slugify_filename(input_path.stem)
    return input_path.with_name(f"{safe_stem}_mobile.pdf")


def optimize_pdf(input_path: Path, output_path: Path, dpi: int, quality: int) -> None:
    fitz = import_pymupdf()

    source = fitz.open(input_path)
    optimized = fitz.open()

    try:
        for page_number, page in enumerate(source, start=1):
            rect = page.rect
            pixmap = page.get_pixmap(dpi=dpi, alpha=False)
            image = pixmap.tobytes("jpeg", jpg_quality=quality)

            new_page = optimized.new_page(width=rect.width, height=rect.height)
            new_page.insert_image(rect, stream=image)

            print(f"Pagina {page_number}/{source.page_count} optimizada")

        output_path.parent.mkdir(parents=True, exist_ok=True)
        optimized.save(output_path, garbage=4, deflate=True, clean=True)
    finally:
        optimized.close()
        source.close()


def format_mb(bytes_value: int) -> str:
    return f"{bytes_value / 1024 / 1024:.2f} MB"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Crea una version ligera de un PDF para dispositivos moviles."
    )
    parser.add_argument("pdf", help="Ruta del PDF original")
    parser.add_argument(
        "-o",
        "--output",
        help="Ruta del PDF optimizado. Si se omite, se crea junto al original.",
    )
    parser.add_argument(
        "--dpi",
        type=int,
        default=DEFAULT_DPI,
        help=f"Resolucion de renderizado. Valor por defecto: {DEFAULT_DPI}",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=DEFAULT_QUALITY,
        help=f"Calidad JPEG de 1 a 100. Valor por defecto: {DEFAULT_QUALITY}",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    input_path = Path(args.pdf)

    if not input_path.exists():
        raise SystemExit(f"No existe el archivo: {input_path}")

    if input_path.suffix.lower() != ".pdf":
        raise SystemExit("El archivo de entrada debe ser un PDF.")

    if not 1 <= args.quality <= 100:
        raise SystemExit("La calidad debe estar entre 1 y 100.")

    if args.dpi <= 0:
        raise SystemExit("El valor de --dpi debe ser mayor que 0.")

    output_path = Path(args.output) if args.output else default_output_path(input_path)

    print(f"PDF original:   {input_path}")
    print(f"PDF optimizado: {output_path}")
    print(f"DPI: {args.dpi} | Calidad: {args.quality}")

    optimize_pdf(input_path, output_path, args.dpi, args.quality)

    original_size = input_path.stat().st_size
    optimized_size = output_path.stat().st_size
    saved_size = original_size - optimized_size

    print()
    print("Listo.")
    print(f"Original:   {format_mb(original_size)}")
    print(f"Optimizado: {format_mb(optimized_size)}")
    print(f"Ahorro:     {format_mb(saved_size)}")


if __name__ == "__main__":
    main()
