$files = @(
    "src\Pages\UniversityExamTakingPage.jsx",
    "src\Pages\UniversityExamInstructionsPage.jsx",
    "src\Pages\TermsAndConditions.jsx",
    "src\Pages\SmartTrackingPage.jsx",
    "src\Pages\SignUp.jsx",
    "src\Pages\RefundPolicy.jsx",
    "src\Pages\QuizTakingPage.jsx",
    "src\Pages\QuizStart.jsx",
    "src\Pages\QuizResultsPage.jsx",
    "src\Pages\QuizHistoryPage.jsx",
    "src\Pages\PrivacyPolicies.jsx",
    "src\Pages\ProfilePage.jsx",
    "src\Pages\PricingPage.jsx",
    "src\Pages\NotesPage.jsx",
    "src\Pages\Home.jsx",
    "src\Pages\Dashboard.jsx",
    "src\Pages\ContactUs.jsx",
    "src\Pages\ChaptersPage.jsx",
    "src\Components\NotificationContainer.jsx",
    "src\Components\PricingCards.jsx",
    "src\Components\ChapterQuizModal.jsx",
    "src\Components\AudioPlayer.jsx",
    "src\Components\UpgradePrompt.jsx"
)

$colors = @('blue', 'pink', 'cyan', 'teal', 'emerald', 'amber', 'fuchsia', 'violet', 'rose')
$regexStr = "-(?:$($colors -join '|'))-"

foreach ($relPath in $files) {
    # Skip Footer and Header to preserve logo/social colors
    if ($relPath -match "Footer|Header") { continue }
    
    $fullPath = Join-Path "c:\Nextjs\fornix-project\fornix-web" $relPath
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        $orig = $content
        
        foreach ($color in $colors) {
            $content = $content -replace "bg-$color-", 'bg-orange-'
            $content = $content -replace "text-$color-", 'text-orange-'
            $content = $content -replace "border-$color-", 'border-orange-'
            $content = $content -replace "ring-$color-", 'ring-orange-'
            $content = $content -replace "from-$color-", 'from-orange-'
            $content = $content -replace "via-$color-", 'via-orange-'
            $content = $content -replace "to-$color-", 'to-orange-'
            $content = $content -replace "shadow-$color-", 'shadow-orange-'
        }
        
        if ($orig -ne $content) {
            Set-Content $fullPath $content -NoNewline
            Write-Host "Replaced colors in $relPath"
        }
    }
}
Write-Host "Color homogenization complete."
