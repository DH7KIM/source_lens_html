# PowerShell sample: variables, strings, functions, loops, pipeline
param(
    [string]$Name = "Source Lens",
    [int]$Count = 3
)

$ErrorActionPreference = "Stop"
$path = 'D:\Projects\source_lens_html'

function Get-Greeting {
    param([string]$Who = "world")
    return "Hello, $Who! ($Name)"
}

# loop with a counter
foreach ($i in 1..$Count) {
    Write-Output (Get-Greeting -Who "user $i")
}

# condition and pipeline
if (Test-Path $path) {
    Get-ChildItem -Path $path -Filter *.md |
        Where-Object { $_.Length -gt 0 } |
        ForEach-Object { Write-Output $_.Name }
}
else {
    Write-Warning "missing: $path"
}
