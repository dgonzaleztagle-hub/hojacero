$source = "d:\proyectos\hojacero\supabase\migrations"
$archive = "d:\proyectos\hojacero\supabase\migrations\archive"

Get-ChildItem -Path $source -File | Where-Object { 
    $_.Name -match "debug" -or 
    $_.Name -match "fix" -or 
    $_.Name -match "check" -or 
    $_.Name -match "cleanup" -or 
    $_.Name -match "repair" -or 
    $_.Name -match "reset" 
} | Move-Item -Destination $archive -Force

Write-Host "Cleanup Complete"
