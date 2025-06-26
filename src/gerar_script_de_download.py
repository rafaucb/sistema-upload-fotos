from supabase import create_client
import os

SUPABASE_URL = "https://ecfhiihpyvludqozrapfi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZmhpaHB5dmx1ZHFvenJhcGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDk0MDgsImV4cCI6MjA2NDcyNTQwOH0.UTar3wCHCM1Pa9SopBHcQqiBxDX-CpDCaZarGBR_oAc"
BUCKET = "fotos-arraia"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Lista os arquivos sem paginação
arquivos = supabase.storage.from_(BUCKET).list()

# Gera o script de download
base_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/"
linhas_script = ["#!/bin/bash\n", "mkdir -p fotos_baixadas\n\n"]

for arquivo in arquivos:
    nome = arquivo["name"]
    url = f"{base_url}{nome}"
    linhas_script.append(f'wget -P fotos_baixadas "{url}"\n')

with open("baixar_tudo.sh", "w") as f:
    f.writelines(linhas_script)

print("✅ Script 'baixar_tudo.sh' gerado com sucesso! Total de arquivos:", len(arquivos))
