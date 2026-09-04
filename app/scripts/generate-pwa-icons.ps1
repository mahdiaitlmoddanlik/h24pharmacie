Add-Type -AssemblyName System.Drawing

$outputDirectory = Join-Path $PSScriptRoot "..\public\icons"
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

function Write-PwaIcon([int]$size, [string]$fileName) {
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml("#047857"))

  $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
  $thickness = [int]($size * 0.22)
  $armLength = [int]($size * 0.62)
  $start = [int](($size - $armLength) / 2)
  $crossStart = [int](($size - $thickness) / 2)

  $graphics.FillRectangle($brush, $start, $crossStart, $armLength, $thickness)
  $graphics.FillRectangle($brush, $crossStart, $start, $thickness, $armLength)
  $bitmap.Save((Join-Path $outputDirectory $fileName), [System.Drawing.Imaging.ImageFormat]::Png)

  $brush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

Write-PwaIcon 192 "icon-192.png"
Write-PwaIcon 512 "icon-512.png"
Write-PwaIcon 180 "icon-180.png"
