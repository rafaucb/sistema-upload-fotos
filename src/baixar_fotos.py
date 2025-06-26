from supabase import create_client
import os
import requests

# === CONFIGURAÇÕES ===
SUPABASE_URL = "https://ecfhiihpyvludqozrapfi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZmhpaHB5dmx1ZHFvenJhcGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDk0MDgsImV4cCI6MjA2NDcyNTQwOH0.UTar3wCHCM1Pa9SopBHcQqiBxDX-CpDCaZarGBR_oAc"
BUCKET = "fotos-arraia"
PASTA_DESTINO = "fotos_baixadas"

# Cria pasta se não existir
os.makedirs(PASTA_DESTINO, exist_ok=True)

# Conecta ao Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Lista os arquivos no bucket
arquivos = supabase.storage.from_(BUCKET).list()

# Baixa um por um
for arquivo in arquivos:
    nome = arquivo["name"]
    url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{nome}"
    destino = os.path.join(PASTA_DESTINO, nome)
    print(f"Baixando {nome}...")

    r = requests.get(url)
    with open(destino, "wb") as f:
        f.write(r.content)

print("✅ Todas as fotos foram baixadas com sucesso!")
