//Put your custom functions and variables in this file

g_browserLibrary = "UnifiedServiceDesk_IE";
g_recordUrls = false;

if (!g_recording)
{
	TestInit = function()
	{
		Global.DoLoadObjects('%WORKDIR%/Objects.js');
		Navigator.EnsureVisibleVerticalAlignment = "center";
	}
}
else
{
	TestPrepare = function()
	{
		g_UIAutomationWrapper.DeepPointTracking(true);
	}
}

function USDLaunch()
{
	var pfFolder = Global.GetSpecialFolderPath("ProgramFilesX86");
	var usdPath = pfFolder + "\\Microsoft Dynamics CRM USD\\USD\\UnifiedServiceDesk.exe"
	if(!File.Exists(usdPath))
	{
		Tester.Message("Unified Service Desk Client is not installed on this computer");
		return;
	}
	
	var windows = g_util.FindWindows("regex:Unified Service Desk.*", "regex:HwndWrapper.*");
	if (windows.length == 0)
	{
		Tester.Message("Unified Service Desk Client is not started.");
		Global.DoLaunch(usdPath);
		zWaitForMainUSDWindow();
		return;
	}
}

function USDClose()
{

}

function zWaitForMainUSDWindow()
{
	var count = 60;
	var found = false;
	while(!found && count > 0)
	{
		var windows = g_util.FindWindows("regex:Unified Service Desk.*", "regex:HwndWrapper.*");
		if (windows.length > 0)
		{
			found = true;
		}
		count--;
		Global.DoSleep(5000);
	}
}
