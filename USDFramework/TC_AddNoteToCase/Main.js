//Use 'Record/Learn' button to begin test recording

function Test(params)
{
	RVL.DoPlayScript("%WORKDIR%\\TC_AddNoteToCase\\Main.rvl.xlsx", "RVL");
}

g_load_libraries=["%g_browserLibrary%", "DomDynamicsCrm", "UIAutomation"]

