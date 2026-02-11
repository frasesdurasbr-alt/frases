"""
Remove todas as frases da tabela no Supabase via REST API.
Use antes de refazer a importação. Requer .env configurado.
"""

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

def limpar_banco():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Erro: Credenciais nao configuradas no .env")
        return False
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    url = f"{SUPABASE_URL}/rest/v1/frases"
    try:
        # PostgREST não permite DELETE sem filtro; buscamos IDs e deletamos em lotes
        total_removidos = 0
        while True:
            resp = httpx.get(f"{url}?select=id&limit=1000", headers=headers, timeout=30.0)
            if resp.status_code != 200:
                print(f"Erro ao listar: HTTP {resp.status_code}")
                return False
            data = resp.json()
            if not data:
                break
            ids = [r['id'] for r in data]
            # DELETE com filter id=in.(1,2,3,...)
            id_list = ",".join(str(i) for i in ids)
            del_resp = httpx.delete(f"{url}?id=in.({id_list})", headers=headers, timeout=30.0)
            if del_resp.status_code not in [200, 204]:
                print(f"Erro ao deletar: HTTP {del_resp.status_code}")
                return False
            total_removidos += len(ids)
            print(f"  -> Removidas {len(ids)} frases (total: {total_removidos})")
        print(f"\nOK Tabela limpa. Total de frases removidas: {total_removidos}")
        return True
    except Exception as e:
        print(f"Erro: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("  LIMPAR TABELA FRASES NO SUPABASE")
    print("=" * 60)
    limpar_banco()
    print("=" * 60)
