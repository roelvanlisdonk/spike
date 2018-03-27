
# Update tooling
nuget update -self
choco upgrade chocolatey -y
choco upgrade nodejs -y
choco upgrade git -y
npm update -g
npm i -g npm

# Check status
Set-Location "C:\Projects\spike\Vue"
git status

# Veranderingen opslaan
git add --all
git commit -m "Kleine aanpassing aan devops scripts"
git pull
git push
git status

# Veranderingen ongedaan maken
git reset --hard

# Controleer of er wijzigingen zijn in de huidige branch.
Set-Location "C:\Projects\spike\Vue"
git status