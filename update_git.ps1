param(
    [Parameter(Position=0,mandatory=$true)][string]$commit_msg
)

git add .
git commit -m "$commit_msg"
git push