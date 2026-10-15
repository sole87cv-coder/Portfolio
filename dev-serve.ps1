# Inicia o servidor local do portfólio em http://localhost:5173.
# Uso:  .\dev-serve.ps1
$ErrorActionPreference = 'Stop'

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Error 'SDK do .NET não encontrado. Instale o .NET 10 para usar este servidor.'
}

Write-Host 'Portfólio em http://localhost:5173  (Ctrl+C para encerrar)'
dotnet run --project (Join-Path $PSScriptRoot 'Portfolio')
