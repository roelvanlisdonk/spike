
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

# Veranderingen ongedaan maken
git reset --hard

# Veranderingen opslaan in master
Set-Location "C:\Projects\spike\Vue"
git fetch --all
git add --all
git commit -m "Kleine aanpassing aan devops scripts"
git pull
git push

# Sync 
Set-Location "C:\Projects\spike\Vue"
git fetch --all
git clean -f
git pull
git push