// Put library code here

function USD_Launch()
{
	USDLaunch();
}

function USD_Login()
{
	USDLogin();
}

function USD_Close()
{
	USDClose();
}

function USD_SetRichText(/**objectId*/ editor, /**string*/ text)
{
	USDSetRichText(editor, text);
}

function USD_SelectWindow(/**string|number*/ urlOrTitleOrIndex, /**number*/ timeout)
{
	USDSelectWindow(urlOrTitleOrIndex, timeout);
}

if (typeof(SeSGlobalObject) != "undefined")
{
	SeSGlobalObject("USD");
}
