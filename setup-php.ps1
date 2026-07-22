$workDir = "e:\Documents\Portfolio\KasBon"
$phpDir = "$workDir\.php"
$binDir = "$phpDir\php-bin"

# Create directories
if (!(Test-Path $phpDir)) { 
    Write-Host "Creating directory $phpDir..."
    New-Item -ItemType Directory -Path $phpDir | Out-Null
}
if (!(Test-Path $binDir)) { 
    Write-Host "Creating directory $binDir..."
    New-Item -ItemType Directory -Path $binDir | Out-Null
}

# 1. Download PHP
$phpZip = "$phpDir\php.zip"
# Use the current stable 8.2 version
$phpUrl = "https://windows.php.net/downloads/releases/php-8.2.31-nts-Win32-vs16-x64.zip"
if (!(Test-Path "$binDir\php.exe")) {
    Write-Host "Downloading PHP 8.2.31 from $phpUrl..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $phpUrl -OutFile $phpZip -UseBasicParsing
    Write-Host "Extracting PHP zip to $binDir..."
    Expand-Archive -Path $phpZip -DestinationPath $binDir -Force
    Write-Host "Cleaning up zip file..."
    Remove-Item $phpZip
} else {
    Write-Host "PHP already downloaded and extracted."
}

# 2. Configure php.ini
$iniPath = "$binDir\php.ini"
if (!(Test-Path $iniPath)) {
    Write-Host "Configuring php.ini from template..."
    Copy-Item "$binDir\php.ini-development" $iniPath
    
    # Read, modify, and write php.ini
    $content = Get-Content $iniPath
    # Un-comment extension_dir and point to ext folder
    $content = $content -replace ';extension_dir = "ext"', 'extension_dir = "ext"'
    # Un-comment common Laravel extensions
    $content = $content -replace ';extension=curl', 'extension=curl'
    $content = $content -replace ';extension=fileinfo', 'extension=fileinfo'
    $content = $content -replace ';extension=mbstring', 'extension=mbstring'
    $content = $content -replace ';extension=openssl', 'extension=openssl'
    $content = $content -replace ';extension=pdo_sqlite', 'extension=pdo_sqlite'
    $content = $content -replace ';extension=sqlite3', 'extension=sqlite3'
    # Increase limits
    $content = $content -replace 'memory_limit = 128M', 'memory_limit = 512M'
    
    $content | Set-Content $iniPath -Force
    Write-Host "php.ini configured successfully."
} else {
    Write-Host "php.ini already exists."
}

# 3. Download Composer
$composerPhar = "$phpDir\composer.phar"
$composerUrl = "https://getcomposer.org/composer.phar"
if (!(Test-Path $composerPhar)) {
    Write-Host "Downloading Composer from $composerUrl..."
    Invoke-WebRequest -Uri $composerUrl -OutFile $composerPhar -UseBasicParsing
    Write-Host "Composer download completed."
} else {
    Write-Host "Composer already exists."
}

# 4. Create batch wrappers for CMD/PowerShell
Write-Host "Creating script wrappers (php.bat and composer.bat)..."
$phpBatContent = @"
@echo off
"$binDir\php.exe" %*
"@
$phpBatContent | Out-File -FilePath "$phpDir\php.bat" -Encoding ascii -Force

$composerBatContent = @"
@echo off
"$binDir\php.exe" "$composerPhar" %*
"@
$composerBatContent | Out-File -FilePath "$phpDir\composer.bat" -Encoding ascii -Force

Write-Host "Environment setup script complete!"
