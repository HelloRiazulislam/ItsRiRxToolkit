Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\ItsRiRx ToolKit.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "powershell.exe"
oLink.Arguments = "-NoProfile -ExecutionPolicy Bypass -Command ""irm https://itsrirx-toolkit.vercel.app/i | iex"""
oLink.Description = "ItsRiRx Windows Tool Kit 1-Click Launcher"
oLink.WorkingDirectory = "%USERPROFILE%"
oLink.IconLocation = "powershell.exe, 0"
oLink.Save
MsgBox "ItsRiRx ToolKit shortcut has been created on your Desktop!", 64, "ItsRiRx ToolKit"
