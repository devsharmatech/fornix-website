# Fix colors in Components
$componentFiles = @(
    'UpgradePrompt.jsx',
    'SubjectQuizModal.jsx',
    'PricingCards.jsx',
    'Leaderboard.jsx',
    'Footer.jsx',
    'DiscussionCard.jsx',
    'ChapterQuizModal.jsx',
    'ChapterCountDisplay.jsx',
    'UniversityExamsSection.jsx'
)

foreach ($file in $componentFiles) {
    $path = "c:\Nextjs\fornix-project\fornix-web\src\Components\$file"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $content = $content -replace 'purple-', 'orange-'
        $content = $content -replace 'indigo-', 'orange-'
        Set-Content $path $content -NoNewline
        Write-Host "Fixed colors in $file"
    }
}

# Fix remaining pages
$pageFiles = @(
    'ProfilePage.jsx',
    'ChaptersPage.jsx',
    'QuizHistoryPage.jsx',
    'PYTTopics.jsx',
    'PYTSubjects.jsx'
)

foreach ($file in $pageFiles) {
    $path = "c:\Nextjs\fornix-project\fornix-web\src\Pages\$file"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $content = $content -replace 'purple-', 'orange-'
        $content = $content -replace 'indigo-', 'orange-'
        Set-Content $path $content -NoNewline
        Write-Host "Fixed colors in $file"
    }
}

# Remove console.log from all page files
$allPages = Get-ChildItem "c:\Nextjs\fornix-project\fornix-web\src\Pages\*.jsx"
foreach ($file in $allPages) {
    $content = Get-Content $file.FullName -Raw
    # Remove standalone console.log lines
    $content = $content -replace '(?m)^\s*console\.(log|debug|info|warn)\(.*?\);\s*\r?\n', ''
    Set-Content $file.FullName $content -NoNewline
    Write-Host "Cleaned console.log from $($file.Name)"
}

Write-Host "`nAll done!"
