"""
Importador de frases para Supabase.
Uma frase por linha nos arquivos TXT (sem filtros adicionais).
Usa httpx.

Uso:
  python import_frases.py [pasta_txt]

  pasta_txt: caminho da pasta com .txt (opcional; padrão: TXT na mesma pasta)
"""

import os
import sys
import httpx
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


def processar_arquivo(caminho_arquivo: str) -> list:
    """
    Lê o arquivo e retorna uma frase por linha.
    Linhas vazias são ignoradas. Nenhum filtro de conteúdo.
    """
    try:
        with open(caminho_arquivo, "r", encoding="utf-8") as f:
            linhas = f.readlines()

        nome_arquivo = os.path.basename(caminho_arquivo)
        frases = []
        for linha in linhas:
            texto = linha.strip()
            if texto:
                frases.append(
                    {
                        "frase": texto,
                        "arquivo_origem": nome_arquivo,
                        "data_importacao": datetime.now().isoformat(),
                    }
                )

        print(f"  → {nome_arquivo}: {len(frases)} frases")
        return frases

    except Exception as e:
        print(f"  ✗ Erro ao processar {caminho_arquivo}: {e}")
        return []


def importar_para_supabase(frases: list) -> bool:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("✗ Credenciais não configuradas! Configure o .env.")
        return False

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    url = f"{SUPABASE_URL}/rest/v1/frases"

    try:
        print("\n⏳ Importando para o Supabase...")
        lote_tamanho = 100
        total = 0
        for i in range(0, len(frases), lote_tamanho):
            lote = frases[i : i + lote_tamanho]
            response = httpx.post(url, headers=headers, json=lote, timeout=30.0)
            if response.status_code in (200, 201):
                total += len(lote)
                print(f"  → Lote {i // lote_tamanho + 1}: {len(lote)} frases")
            else:
                print(f"  ✗ Erro no lote: HTTP {response.status_code}")
                print(response.text[:300])
                return False
        print(f"\n✓ Importação concluída! Total: {total} frases")
        return True
    except Exception as e:
        print(f"\n✗ Erro ao importar: {e}")
        return False


def importar_pasta(caminho_pasta: str, confirmar: bool = True):
    pasta = Path(caminho_pasta)
    if not pasta.exists():
        print(f"✗ Pasta não encontrada: {caminho_pasta}")
        return

    arquivos_txt = list(pasta.glob("*.txt"))
    if not arquivos_txt:
        print(f"✗ Nenhum arquivo .txt em: {caminho_pasta}")
        return

    print(f"\n📁 Encontrados {len(arquivos_txt)} arquivos .txt")
    print("─" * 50)

    todas_frases = []
    for arquivo in sorted(arquivos_txt):
        todas_frases.extend(processar_arquivo(str(arquivo)))

    print("─" * 50)
    print(f"\n📝 Total de frases (uma por linha): {len(todas_frases)}")

    if not todas_frases:
        print("⚠️ Nenhuma frase para importar.")
        return

    if confirmar:
        confirma = input("\n📤 Importar para o Supabase? (s/n) [s]: ").strip().lower()
        if confirma and confirma != "s":
            print("⊘ Importação cancelada.")
            return

    importar_para_supabase(todas_frases)


def main():
    print("=" * 50)
    print("  IMPORTADOR DE FRASES (UMA POR LINHA)")
    print("=" * 50)

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("\n✗ Configure SUPABASE_URL e SUPABASE_KEY no .env")
        return

    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    caminho_pasta = (Path(__file__).parent / "TXT").resolve() if not args else args[0]
    caminho_pasta = str(caminho_pasta).strip('"').strip("'")

    if not args:
        caminho_pasta = (
            input("\n📂 Pasta com os .txt [Enter = TXT]: ").strip().strip('"').strip("'")
            or caminho_pasta
        )

    importar_pasta(caminho_pasta)
    print("\n" + "=" * 50)


if __name__ == "__main__":
    main()
