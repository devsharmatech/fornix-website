$files = Get-ChildItem -Path src -Include *.jsx,*.js -Recurse
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        # Use regex to remove console.log statements efficiently
        $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, 'console\.log\(.*?\);?', '')
        if ($content -ne $newContent) {
            [System.IO.File]::WriteAllText($file.FullName, $newContent)
            Write-Host "Processed: $($file.FullName)"
        }
    } catch {
        Write-Warning "Could not process $($file.FullName): $($_.Exception.Message)"
    }
}
Write-Host "Console.log cleanup complete."
