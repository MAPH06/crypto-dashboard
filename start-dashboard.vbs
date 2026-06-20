Set oShell = CreateObject("WScript.Shell")
oShell.Run "python -m http.server 8080 --directory ""d:\Claude_VSC\crypto-dashboard""", 0, False
